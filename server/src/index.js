import express from 'express';
import cors from 'cors';
import { promoCodesRouter } from './routes/promoCodes.js';
import { checkoutRouter } from './routes/checkout.js';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/promo-codes', promoCodesRouter);
app.use('/api/checkout', checkoutRouter);
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
    console.log(`Stawi API listening on :${PORT}`);
});
