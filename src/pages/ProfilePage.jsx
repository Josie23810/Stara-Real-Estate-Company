import { useState } from 'react';
import { useUser } from '../context/UserContext';

const STATUS_LABELS = {
    verified: 'Verified',
    submitted: 'Submitted for review',
    pending: 'Pending review',
    not_started: 'Not started',
    not_applicable: 'Not applicable',
};

export default function ProfilePage({ navigate }) {
    const { user, profile, updateProfile, profileCompletion, verification, verificationDocuments, submitVerificationDocument } = useUser();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        phone: user?.phone || profile.phone || '',
        country: profile.country || 'Kenya',
        county: profile.county || '',
        town: profile.town || '',
        bio: profile.bio || '',
    });

    if (!user) {
        return <div className="min-h-[60vh] flex items-center justify-center p-6"><button onClick={() => navigate('home')} className="rounded-xl bg-[#E85D04] px-5 py-3 font-semibold text-white">Return home</button></div>;
    }

    const saveProfile = (event) => {
        event.preventDefault();
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
    };
    const handleDocumentUpload = (type, event) => {
        const document = event.target.files?.[0];
        if (document) submitVerificationDocument(type, document);
    };

    return (<div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#1A2234] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button onClick={() => navigate('home')} className="text-sm text-white/70 hover:text-white mb-6">← Back to STARA</button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-2xl object-cover border-2 border-white/20"/>
            <div>
              <p className="text-[#F4A100] text-xs font-bold uppercase tracking-widest">My STARA profile</p>
              <h1 className="text-2xl font-bold mt-1">{user.name}</h1>
              <p className="text-white/65 text-sm capitalize">{user.role.replace('-', ' ')} · {user.email}</p>
            </div>
            <div className="sm:ml-auto rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-xs text-white/65">Profile completeness</p>
              <p className="text-2xl font-bold text-[#F4A100]">{profileCompletion}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 space-y-6">
          <form onSubmit={saveProfile} className="rounded-2xl border border-[#E7E5E0] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div><h2 className="font-bold text-[#1C1917]">Personal information</h2><p className="text-xs text-[#78716C] mt-1">Keep your details current so STARA can personalise your experience.</p></div>
              {saved && <span className="text-xs font-semibold text-green-600">Changes saved</span>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-[#57534E]">Full name<input value={user.name} disabled className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] bg-[#F5F4F0] px-3 py-2.5 text-sm"/></label>
              <label className="text-sm font-medium text-[#57534E]">Email<input value={user.email} disabled className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] bg-[#F5F4F0] px-3 py-2.5 text-sm"/></label>
              <label className="text-sm font-medium text-[#57534E]">Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+254..." className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85D04]"/></label>
              <label className="text-sm font-medium text-[#57534E]">Country<input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85D04]"/></label>
              <label className="text-sm font-medium text-[#57534E]">County<input value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} placeholder="e.g. Nairobi" className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85D04]"/></label>
              <label className="text-sm font-medium text-[#57534E]">Town<input value={form.town} onChange={e => setForm({ ...form, town: e.target.value })} placeholder="e.g. Westlands" className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85D04]"/></label>
              <label className="text-sm font-medium text-[#57534E] sm:col-span-2">Bio<textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell the STARA community a little about yourself..." className="mt-1.5 w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85D04]"/></label>
            </div>
            <button type="submit" className="mt-5 rounded-xl bg-[#E85D04] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C54D03]">Save profile</button>
          </form>

          <section className="rounded-2xl border border-[#E7E5E0] bg-white p-5 sm:p-6">
            <h2 className="font-bold text-[#1C1917]">Verification centre</h2>
            <p className="text-xs text-[#78716C] mt-1">Verification badges are only shown after the applicable review is complete.</p>
            <div className="mt-5 space-y-3">
              {Object.entries(verification).map(([type, status]) => (<div key={type} className="rounded-xl border border-[#F5F4F0] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-sm font-semibold capitalize text-[#1C1917]">{type} verification</p><p className="text-xs text-[#78716C]">{STATUS_LABELS[status] || status}</p></div>
                <div className="flex items-center gap-2">
                  {status === 'verified' && <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">✓ Verified</span>}
                  {(status === 'pending' || status === 'submitted') && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{status === 'submitted' ? 'Submitted' : 'Under review'}</span>}
                  {status === 'not_applicable' && <span className="text-xs text-[#A8A29E]">—</span>}
                </div>
                </div>
                {status !== 'verified' && status !== 'not_applicable' && <label className="mt-3 block cursor-pointer rounded-lg border border-dashed border-[#D6D3CD] px-3 py-2 text-xs text-[#78716C] hover:border-[#E85D04] hover:text-[#E85D04]">
                  <span>{verificationDocuments[type]?.name || (type === 'email' || type === 'phone' ? 'Upload confirmation document or proof' : 'Upload a government-issued document')}</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => handleDocumentUpload(type, event)} className="sr-only"/>
                </label>}
              </div>))}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E7E5E0] bg-white p-5">
            <h2 className="font-bold text-[#1C1917]">Complete your profile</h2>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#F5F4F0]"><div className="h-full rounded-full bg-gradient-to-r from-[#E85D04] to-[#F4A100]" style={{ width: `${profileCompletion}%` }}/></div>
            <p className="mt-2 text-xs text-[#78716C]">{profileCompletion === 100 ? 'Your profile is complete.' : 'Add your location and preferences to improve property recommendations.'}</p>
          </section>
          <section className="rounded-2xl border border-[#E7E5E0] bg-white p-5">
            <h2 className="font-bold text-[#1C1917] mb-3">Quick actions</h2>
            <div className="space-y-2">
              <button onClick={() => navigate('dashboard')} className="w-full rounded-xl bg-[#FFF7F0] px-3 py-2.5 text-left text-sm font-semibold text-[#A94605]">Open dashboard →</button>
              <button onClick={() => navigate('search')} className="w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-left text-sm font-semibold text-[#57534E]">Explore properties →</button>
              <button onClick={() => navigate('ai-assistant')} className="w-full rounded-xl border border-[#E7E5E0] px-3 py-2.5 text-left text-sm font-semibold text-[#57534E]">Ask STARA →</button>
            </div>
          </section>
        </aside>
      </div>
    </div>);
}
