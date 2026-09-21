import heroImage from '../imports/precondo-ca-QHDFm084RNk-unsplash.jpg';
import lifestyleImage from '../imports/clay-banks-urH155LONWs-unsplash.jpg';
import image01 from '../../image01.jpg';
import image02 from '../../image02.jpg';
import image03 from '../../image03.jpg';
import image04 from '../../image04.jpg';
import image05 from '../../image05.jpg';
import image06 from '../../image06.jpg';
import image07 from '../../image07.jpg';
import interiorImage from '../../francesca-tosolini-tHkJAMcO3QE-unsplash.jpg';
import homeImage from '../../avi-waxman-f9qZuKoZYoY-unsplash.jpg';

const FEATURES = [
  ['Find a property', 'Search by location, price, type, bedrooms, amenities, and availability.', 'all', image04],
  ['Rent with confidence', 'Compare homes by budget, furnishing, amenities, and availability.', 'rent', image05],
  ['Buy property', 'Discover purchase opportunities and organise your search from one account.', 'sale', image06],
  ['Sell or list', 'Create listings, add images, receive enquiries, and monitor activity.', 'landlord', image07],
  ['Manage property', 'Keep properties, tenants, communications, and operations connected.', 'landlord', image02],
  ['Ask STARA', 'Describe what you need naturally and get conversational property guidance.', 'ai-assistant', image03],
];

const AUDIENCE = [
  ['Buyers', 'Discover and compare properties for purchase.'],
  ['Tenants', 'Find rentals that match your needs and budget.'],
  ['Sellers', 'List and manage properties available for sale.'],
  ['Landlords', 'List rentals and manage property activities.'],
  ['Agents', 'Manage listings, clients, enquiries, and opportunities.'],
  ['Investors', 'Discover and organise real-estate opportunities.'],
  ['Property managers', 'Coordinate properties, tenants, and operations.'],
  ['Professionals', 'Connect with people who need relevant services.'],
];

export default function AboutPage({ navigate, onShowAuth }) {
  const search = (filter = 'all') => navigate('search', undefined, filter);

  return (
    <div className="bg-[#FAFAF8] text-[#1C1917]">
      <section className="relative min-h-[560px] overflow-hidden">
        <img src={heroImage} alt="Modern Kenyan home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10151F]/90 via-[#1A2234]/70 to-[#1A2234]/20" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F4A100] sm:text-sm">Kenya-wide property search</p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">Reimagining the<br /><span className="text-[#F4A100]">real-estate experience.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              STARA is a digital real-estate platform designed to make finding, renting, buying, selling, investing in, and managing property easier, smarter, and more transparent.
            </p>
            <div className="mt-8 max-w-2xl rounded-2xl bg-white p-3 shadow-2xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded-xl bg-[#F5F4F0] px-4 py-3 text-sm text-[#57534E]">Find a place, investment, or opportunity</div>
                <button onClick={() => search()} className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>Explore properties</button>
              </div>
            </div>
            <button onClick={() => navigate('ai-assistant')} className="mt-5 inline-flex items-center px-1 py-2 text-sm font-semibold text-white/80 transition hover:text-white">Need help choosing? Ask STARA <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">One connected platform</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What does STARA do?</h2>
          <p className="mt-5 text-base leading-8 text-[#57534E]">
            STARA brings property seekers, owners, landlords, sellers, agents, investors, managers, and real-estate professionals together in one connected platform.
          </p>
          <p className="mt-4 text-base leading-8 text-[#57534E]">
            Instead of moving between multiple platforms, websites, agents, and disconnected services, STARA helps you move from discovery to action in one place.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-sm font-semibold">
            {['Discover', 'Compare', 'Connect', 'Act', 'Manage'].map((item, index) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#E7E5E0]">
                <span className="text-[#E85D04]">0{index + 1}</span>{item}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={lifestyleImage} alt="Bright home interior" className="h-64 w-full rounded-2xl object-cover sm:h-80" />
          <img src={image01} alt="Aerial view of a developing countryside community" className="mt-10 h-64 w-full rounded-2xl object-cover sm:h-80" />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">The STARA experience</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything property, beautifully connected.</h2>
            </div>
            <button onClick={() => search()} className="self-start text-sm font-semibold text-[#E85D04] hover:underline">View all properties →</button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([title, text, destination, image]) => (
              <article key={title} className="group overflow-hidden rounded-2xl border border-[#E7E5E0] bg-[#FAFAF8] transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10151F]/65 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1A2234]">STARA</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#78716C]">{text}</p>
                  <button onClick={() => destination === 'search' ? search() : destination === 'all' || destination === 'rent' || destination === 'sale' ? search(destination) : navigate(destination)} className="mt-4 text-sm font-semibold text-[#E85D04]">
                    {destination === 'ai-assistant' ? 'Ask STARA' : 'Explore'} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">Property, from every angle</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A clearer view of the places and possibilities ahead.</h2>
          <p className="mt-5 text-base leading-8 text-[#57534E]">
            From a first search to a long-term property portfolio, STARA gives every part of your journey a more connected home. Explore residential neighbourhoods, discover land and development opportunities, and imagine the spaces you can make your own.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
          <figure className="group relative overflow-hidden rounded-2xl md:col-span-7 md:row-span-2">
            <img src={image01} alt="Aerial view of homes and streets" className="h-full min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10151F]/85 to-transparent p-6 pt-20 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F4A100]">Find your place</p>
              <p className="mt-1 text-xl font-bold">Neighbourhoods, homes, and opportunities in one view.</p>
            </figcaption>
          </figure>
          <figure className="group relative overflow-hidden rounded-2xl md:col-span-5">
            <img src={image02} alt="Private pool and outdoor living space" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 md:h-full" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10151F]/80 to-transparent p-5 pt-16 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F4A100]">Live well</p>
              <p className="mt-1 text-lg font-bold">Spaces that feel like home.</p>
            </figcaption>
          </figure>
          <figure className="group relative overflow-hidden rounded-2xl md:col-span-5">
            <img src={image03} alt="Green countryside property and home" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 md:h-full" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10151F]/80 to-transparent p-5 pt-16 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F4A100]">Grow with confidence</p>
              <p className="mt-1 text-lg font-bold">A future shaped around your goals.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <img src={homeImage} alt="Family home exterior" className="h-[420px] w-full rounded-[2rem] object-cover" />
            <div className="absolute -bottom-6 -right-3 max-w-[220px] rounded-2xl bg-[#1A2234] p-5 text-white shadow-xl sm:-right-6">
              <p className="text-3xl font-bold text-[#F4A100]">1</p>
              <p className="mt-1 text-sm leading-5 text-white/70">trusted digital space for the entire property journey</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">Built on trust</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Clearer information for important decisions.</h2>
            <p className="mt-5 text-base leading-8 text-[#57534E]">
              Real estate involves important decisions. STARA incorporates verification features for users and properties where applicable, clearly distinguishing verified, pending, unverified, and user-provided information.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ['Verification', 'Know what has been checked and what has been provided.'],
                ['Intelligent search', 'Describe what you need naturally and find relevant options.'],
                ['Personalised experience', 'Your STARA journey adapts to your role and needs.'],
                ['Mobile first', 'Stay connected from your phone, tablet, or computer.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-[#E7E5E0] bg-white p-4">
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#78716C]">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-[#78716C]">STARA does not guarantee investment returns. Investment decisions remain the responsibility of the individual user.</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">More than a marketplace</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A complete real-estate ecosystem for every next step.</h2>
            <p className="mt-5 text-base leading-8 text-[#57534E]">
              STARA is built for the full property lifecycle. Search intelligently, save and compare your options, connect with the right people, and keep your property activities organised after the viewing or transaction.
            </p>
            <div className="mt-7 space-y-4">
              {[
                ['For property seekers', 'Search homes, rentals, land, commercial spaces, and new developments with useful filters and conversational help.'],
                ['For property owners', 'Present your property clearly, manage enquiries, and stay connected to potential tenants or buyers.'],
                ['For professionals and managers', 'Organise listings, clients, tenant activities, communications, and operations from one platform.'],
              ].map(([title, text]) => (
                <div key={title} className="border-l-2 border-[#F4A100] pl-4">
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#78716C]">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={homeImage} alt="A welcoming residential community" className="h-[430px] w-full rounded-[2rem] object-cover" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E85D04]">The STARA promise</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#1A2234]">Make property decisions with more context, more connection, and less friction.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1A2234] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F4A100]">Meet Ask STARA</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Your intelligent real-estate assistant.</h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Instead of navigating complicated filters, describe what you are looking for. Ask STARA can interpret your request and help you discover relevant properties available within the platform.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.08] p-5 text-sm italic leading-7 text-white/80">“I’m looking for a two-bedroom apartment in Kilimani under KES 60,000.”</div>
            <button onClick={() => navigate('ai-assistant')} className="mt-6 rounded-xl bg-[#F4A100] px-5 py-3 text-sm font-semibold text-[#1A2234] hover:bg-[#FFB830]">Start a conversation →</button>
          </div>
          <div className="overflow-hidden rounded-[2rem]">
            <img src={interiorImage} alt="Sunset over open land and property opportunities" className="h-80 w-full object-cover sm:h-[420px]" />
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">Who STARA is for</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">One ecosystem, many journeys.</h2>
            <p className="mt-4 text-base leading-8 text-[#57534E]">We connect the people who make real estate move.</p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map(([title, text]) => <div key={title} className="rounded-2xl border border-[#F4A100]/20 bg-white p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#78716C]">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-5 md:grid-cols-3">
          <img src={image01} alt="Neighbourhood from above" className="h-72 w-full rounded-2xl object-cover md:h-96" />
          <div className="flex flex-col justify-center rounded-2xl bg-white p-7 ring-1 ring-[#E7E5E0] md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85D04]">Our vision</p>
            <h2 className="mt-3 text-2xl font-bold">A smarter, more connected real-estate ecosystem.</h2>
            <p className="mt-4 text-sm leading-7 text-[#57534E]">We envision a future where finding a home, managing a property, connecting with professionals, or exploring opportunities can happen through one trusted digital experience.</p>
          </div>
          <img src={image02} alt="Homes in a green neighbourhood" className="h-72 w-full rounded-2xl object-cover md:h-96" />
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#E85D04] to-[#F4A100]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">Your real-estate journey starts with STARA</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Discover. Connect. Move forward.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85">Whether you are searching for your next home, listing a property, managing properties, exploring opportunities, or providing real-estate services, STARA is designed to help.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => search()} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#C54D03] hover:bg-white/90">Explore Properties</button>
            <button onClick={() => search('rent')} className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">Find a Rental</button>
            <button onClick={() => navigate('landlord')} className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">List Your Property</button>
            <button onClick={() => navigate('ai-assistant')} className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">Ask STARA</button>
            <button onClick={onShowAuth} className="rounded-xl bg-[#1A2234] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2A3450]">Create an Account</button>
          </div>
          <p className="mt-7 font-semibold text-white">Welcome to STARA.</p>
        </div>
      </section>
    </div>
  );
}
