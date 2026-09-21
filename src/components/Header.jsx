import { useState } from 'react';
import CartIcon from './cart/CartIcon';
import { useCart } from '../context/CartContext';
export default function Header({ user, currentPage, navigate, onShowAuth, onSignOut, notifications }) {
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navLinks = [
        { label: 'Explore', page: 'search', searchFilter: 'all' },
        { label: 'Buy', page: 'search', searchFilter: 'sale' },
        { label: 'Rent', page: 'search', searchFilter: 'rent' },
        { label: 'Land', page: 'search', searchFilter: 'land' },
        { label: 'Commercial', page: 'search', searchFilter: 'commercial' },
        { label: 'New Developments', page: 'search', searchFilter: 'new-development' },
        { label: 'Professionals', page: 'professionals' },
        { label: 'Newsroom', page: 'newsroom' },
    ];
    const dashboardPage = user?.role === 'agent' ? 'agent' : user?.role === 'landlord' ? 'landlord' : user?.role === 'tenant' ? 'tenant' : user?.role === 'investor' ? 'investor' : user?.role === 'admin' ? 'admin' : 'dashboard';
    return (<>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => navigate('home')} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 8V18H12V12H8V18H2V8L10 2Z" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[15px] tracking-tight text-[#1C1917]">STARA</span>
                <span className="text-[9px] text-[#78716C] font-medium tracking-widest">REAL ESTATE</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 6).map((link) => (<button key={link.label} onClick={() => navigate(link.page, undefined, link.searchFilter)} className="px-3 py-1.5 text-[13px] font-medium text-[#57534E] hover:text-[#E85D04] hover:bg-[#FFF7F0] rounded-lg transition-colors">
                  {link.label}
                </button>))}
              <div className="w-px h-5 bg-[#E7E5E0] mx-1"/>
              {navLinks.slice(6).map((link) => (<button key={link.label} onClick={() => navigate(link.page, undefined, link.searchFilter)} className="px-3 py-1.5 text-[13px] font-medium text-[#57534E] hover:text-[#E85D04] hover:bg-[#FFF7F0] rounded-lg transition-colors">
                  {link.label}
                </button>))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <CartIcon onClick={() => navigate('cart')}/>
              {user ? (<>
                  <button onClick={() => navigate(dashboardPage)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#57534E] hover:text-[#E85D04] hover:bg-[#FFF7F0] rounded-lg transition-colors">
                    Dashboard
                  </button>
                  <button className="relative p-2 rounded-lg hover:bg-[#F5F4F0] transition-colors" onClick={() => navigate(dashboardPage)} title="Notifications">
                    <svg className="w-5 h-5 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    {notifications > 0 && (<span className="absolute top-1 right-1 w-4 h-4 bg-[#E85D04] rounded-full text-[9px] font-bold text-white flex items-center justify-center notif-dot">
                        {notifications}
                      </span>)}
                  </button>
                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#E7E5E0] hover:border-[#E85D04] transition-colors">
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover"/>
                      <span className="hidden sm:block text-[13px] font-medium text-[#1C1917]">{user.name.split(' ')[0]}</span>
                      <svg className="w-3.5 h-3.5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    {profileOpen && (<div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E7E5E0] rounded-xl shadow-xl py-1 z-50" onClick={() => setProfileOpen(false)}>
                        <div className="px-4 py-3 border-b border-[#F5F4F0]">
                          <p className="text-sm font-semibold text-[#1C1917]">{user.name}</p>
                          <p className="text-xs text-[#78716C] capitalize">{user.role}</p>
                        </div>
                        {[
                    { label: 'My Dashboard', page: dashboardPage },
                    { label: 'Saved Properties', page: 'dashboard' },
                    { label: 'Messages', page: 'dashboard' },
                    { label: 'Profile Settings', page: 'profile' },
                ].map((item) => (<button key={item.label} onClick={() => navigate(item.page)} className="w-full text-left px-4 py-2 text-sm text-[#57534E] hover:bg-[#F5F4F0] hover:text-[#E85D04] transition-colors">
                            {item.label}
                          </button>))}
                        <div className="border-t border-[#F5F4F0] mt-1 pt-1">
                          <button onClick={onSignOut} className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                            Sign Out
                          </button>
                        </div>
                      </div>)}
                  </div>
                </>) : (<>
                  <button onClick={onShowAuth} className="hidden sm:block px-4 py-2 text-[13px] font-semibold text-[#57534E] hover:text-[#E85D04] transition-colors">
                    Sign In
                  </button>
                  <button onClick={onShowAuth} className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-all hover:shadow-md active:scale-95" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    Register
                  </button>
                </>)}

              {/* Mobile Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#F5F4F0] transition-colors ml-1">
                <svg className="w-5 h-5 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (<div className="lg:hidden border-t border-[#E7E5E0] bg-white" onClick={() => setMobileOpen(false)}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (<button key={link.label} onClick={() => navigate(link.page, undefined, link.searchFilter)} className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#57534E] hover:text-[#E85D04] hover:bg-[#FFF7F0] rounded-lg transition-colors">
                  {link.label}
                </button>))}
              <div className="pt-2 border-t border-[#F5F4F0] flex gap-2">
                {user ? (<button onClick={onSignOut} className="flex-1 py-2.5 text-sm font-semibold text-[#DC2626] border border-[#FECACA] rounded-lg">Sign Out</button>) : (<>
                    <button onClick={onShowAuth} className="flex-1 py-2.5 text-sm font-semibold text-[#E85D04] border border-[#E85D04] rounded-lg">Sign In</button>
                    <button onClick={onShowAuth} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>Register</button>
                  </>)}
              </div>
            </div>
          </div>)}
      </header>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E7E5E0] shadow-[0_-4px_16px_rgba(28,25,23,0.08)] pb-[env(safe-area-inset-bottom)]" aria-label="Mobile navigation">
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {[
            { label: 'Home', icon: '⌂', page: 'home' },
            { label: 'Explore', icon: '⌕', page: 'search' },
        ].map((item) => (<button key={item.label} onClick={() => navigate(item.page)} className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs font-semibold transition-colors ${currentPage === item.page ? 'text-[#E85D04]' : 'text-[#78716C]'}`} aria-label={item.label}>
              <span className="text-2xl leading-6">{item.icon}</span>
              <span>{item.label}</span>
            </button>))}
          <button onClick={() => user ? navigate('profile') : onShowAuth()} className={`flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs font-semibold transition-colors ${currentPage === 'profile' ? 'text-[#E85D04]' : 'text-[#78716C]'}`} aria-label="Profile">
            <span className="text-2xl leading-6">◯</span>
            <span>Profile</span>
          </button>
          <button onClick={() => navigate('cart')} className={`relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs font-semibold transition-colors ${currentPage === 'cart' ? 'text-[#E85D04]' : 'text-[#78716C]'}`} aria-label="Cart">
            <span className="text-2xl leading-6">🛒</span>
            <span>Cart</span>
            {itemCount > 0 && <span className="absolute top-1/2 left-1/2 ml-2 -mt-5 min-w-4 h-4 px-1 rounded-full bg-[#E85D04] text-white text-[9px] flex items-center justify-center">{itemCount > 99 ? '99+' : itemCount}</span>}
          </button>
        </div>
      </nav>
    </>);
}
