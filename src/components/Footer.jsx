export default function Footer({ navigate }) {
    return (<footer className="bg-[#1A2234] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 8V18H12V12H8V18H2V8L10 2Z" fill="white"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[15px] tracking-tight text-white">STARA</span>
                <span className="text-[9px] text-[#8B949E] font-medium tracking-widest">REAL ESTATE</span>
              </div>
            </button>
            <p className="text-sm text-[#8B949E] leading-relaxed mb-4">
              Kenya&apos;s premier real estate technology ecosystem. Find property, find opportunity.
            </p>
            <div className="flex gap-3">
              {['twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (<button key={social} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E85D04] flex items-center justify-center transition-colors">
                  <span className="text-[10px] font-bold text-white uppercase">{social[0]}</span>
                </button>))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Properties</h4>
            <ul className="space-y-2.5">
              {[
                ['Buy Property', 'sale'],
                ['Rent Property', 'rent'],
                ['Land', 'land'],
                ['Commercial', 'commercial'],
                ['New Developments', 'new-development'],
              ].map(([item, filter]) => (<li key={item}>
                  <button onClick={() => navigate('search', undefined, filter)} className="text-sm text-[#8B949E] hover:text-[#F4A100] transition-colors">
                    {item}
                  </button>
                </li>))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
            { label: 'For Landlords', page: 'landlord' },
            { label: 'For Tenants', page: 'tenant' },
            { label: 'For Agents', page: 'agent' },
            { label: 'For Investors', page: 'investor' },
            { label: 'Agency Platform', page: 'agency' },
        ].map((item) => (<li key={item.label}>
                  <button onClick={() => navigate(item.page)} className="text-sm text-[#8B949E] hover:text-[#F4A100] transition-colors">
                    {item.label}
                  </button>
                </li>))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
            { label: 'Newsroom', page: 'newsroom' },
            { label: 'Gallery', page: 'gallery' },
            { label: 'Community', page: 'community' },
            { label: 'Professionals', page: 'professionals' },
            { label: 'Financial Tools', page: 'financial-tools' },
            { label: 'Help Center', page: 'help' },
        ].map((item) => (<li key={item.label}>
                  <button onClick={() => navigate(item.page)} className="text-sm text-[#8B949E] hover:text-[#F4A100] transition-colors">
                    {item.label}
                  </button>
                </li>))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About STARA', 'About Zoey', 'Careers', 'Press', 'Advertise', 'Contact Us'].map((item) => (<li key={item}>
                  <button className="text-sm text-[#8B949E] hover:text-[#F4A100] transition-colors">
                    {item}
                  </button>
                </li>))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8B949E]">
            © 2026 STARA Real Estate. All rights reserved. Registered in Kenya.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (<button key={item} className="text-xs text-[#8B949E] hover:text-[#F4A100] transition-colors">
                {item}
              </button>))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-xs text-[#8B949E]">App available on:</span>
          {['App Store', 'Google Play'].map((store) => (<button key={store} className="px-3 py-1.5 border border-white/20 rounded-lg text-xs font-medium text-white hover:bg-white/10 transition-colors">
              {store}
            </button>))}
          <span className="ml-auto text-xs text-[#8B949E]">
            🇰🇪 Kenya-first · Africa-ready
          </span>
        </div>
      </div>
    </footer>);
}
