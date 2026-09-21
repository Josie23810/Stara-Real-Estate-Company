import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('stara.install-dismissed') === 'true');

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!promptEvent || dismissed) return null;

  const install = async () => {
    await promptEvent.prompt();
    setPromptEvent(null);
  };

  const dismiss = () => {
    localStorage.setItem('stara.install-dismissed', 'true');
    setDismissed(true);
  };

  return (
    <aside className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-[60] bg-white border border-[#E7E5E0] rounded-2xl shadow-2xl p-5" role="dialog" aria-label="Install STARA">
      <p className="font-bold text-[#1C1917]">Take STARA with you</p>
      <p className="text-sm text-[#78716C] mt-1">Install STARA for a faster, app-like property experience.</p>
      <div className="flex gap-3 mt-4">
        <button onClick={install} className="flex-1 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm">Install STARA</button>
        <button onClick={dismiss} className="px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm font-semibold text-[#57534E]">Not now</button>
      </div>
    </aside>
  );
}
