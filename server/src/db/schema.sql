-- STAWI DATABASE SCHEMA
-- Core tables backing: User Context, the three-cart system, and promo codes.
-- Run against Postgres 14+.

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- ============================================================
-- USERS & USER CONTEXT
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'buyer','tenant','landlord','seller','agent',
  'agency','developer','investor','property-manager','admin'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'buyer',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  trust_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fine-grained permissions, independent of role, for one-off grants.
-- Role -> default permission mapping lives in application code
-- (server/src/middleware/auth.ts); this table is for overrides.
CREATE TABLE user_permissions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, permission)
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  property_type TEXT,
  buy_or_rent TEXT,
  preferred_counties TEXT[] NOT NULL DEFAULT '{}',
  preferred_towns TEXT[] NOT NULL DEFAULT '{}',
  budget_min NUMERIC,
  budget_max NUMERIC,
  bedrooms INT,
  bathrooms INT,
  communication_prefs JSONB NOT NULL DEFAULT '{"email":true,"sms":false,"whatsapp":true}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE saved_properties (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

CREATE TABLE recent_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_recent_searches_user ON recent_searches(user_id, created_at DESC);

CREATE TABLE recently_viewed (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

-- ============================================================
-- CARTS (shared infrastructure for all three cart types)
-- ============================================================

CREATE TYPE cart_type AS ENUM ('PROPERTY_SERVICE', 'PROPERTY_RESERVATION', 'SUBSCRIPTION_SERVICE');
CREATE TYPE cart_status AS ENUM ('active', 'pending_payment', 'payment_processing', 'confirmed', 'cancelled', 'expired');

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cart_type cart_type NOT NULL,
  status cart_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- One active cart per user per cart type.
CREATE UNIQUE INDEX idx_one_active_cart_per_type
  ON carts(user_id, cart_type) WHERE status = 'active';

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- e.g. 'verification_service', 'development_unit_reservation', 'agent_subscription'
  reference_id UUID,        -- property id / service id / plan id
  title TEXT NOT NULL,
  provider TEXT,
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  billing_period TEXT,      -- 'month' | 'year' | 'one-time', subscriptions only
  status cart_status NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ============================================================
-- PROMO CODES
-- ============================================================

CREATE TYPE promo_type AS ENUM (
  'percentage', 'fixed_amount', 'first_time_user', 'referral',
  'campaign', 'professional_service', 'listing', 'subscription', 'limited_time'
);

CREATE TABLE promo_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  campaign_id UUID REFERENCES promo_campaigns(id) ON DELETE SET NULL,
  promo_type promo_type NOT NULL,

  percentage_off NUMERIC CHECK (percentage_off IS NULL OR (percentage_off > 0 AND percentage_off <= 100)),
  fixed_amount_off NUMERIC CHECK (fixed_amount_off IS NULL OR fixed_amount_off > 0),
  max_discount_amount NUMERIC,
  min_transaction_value NUMERIC NOT NULL DEFAULT 0,

  applicable_cart_types cart_type[] NOT NULL DEFAULT ARRAY['PROPERTY_SERVICE','PROPERTY_RESERVATION','SUBSCRIPTION_SERVICE']::cart_type[],
  applicable_item_types TEXT[],       -- NULL = all item types
  applicable_roles user_role[],       -- NULL = all roles
  applicable_locations TEXT[],        -- counties; NULL = all locations

  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  usage_limit INT,                    -- NULL = unlimited total uses
  per_user_limit INT NOT NULL DEFAULT 1,
  times_used INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,

  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK (
    (promo_type = 'percentage' AND percentage_off IS NOT NULL)
    OR (promo_type != 'percentage')
  )
);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(active, expires_at);

CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  cart_id UUID REFERENCES carts(id),
  order_id UUID,
  discount_applied NUMERIC NOT NULL,
  original_amount NUMERIC NOT NULL,
  final_amount NUMERIC NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_promo_usage_code_user ON promo_code_usage(promo_code_id, user_id);

-- ============================================================
-- ORDERS (checkout output — one row per completed/attempted checkout)
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  cart_id UUID REFERENCES carts(id),
  cart_type cart_type NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC NOT NULL DEFAULT 0,
  fees NUMERIC NOT NULL DEFAULT 0,
  taxes NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  promo_code_id UUID REFERENCES promo_codes(id),
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
