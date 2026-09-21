import { useState } from 'react';
import { MOCK_USER } from '../data/mockData';
const ACCOUNTS_STORAGE_KEY = 'stara.registered-accounts';
const EMAIL_OUTBOX_KEY = 'stara.email-outbox';
const suggestUsername = (fullName) => {
    const base = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'stara.user';
    return base.slice(0, 24);
};
const ROLES = [
    { value: 'buyer', label: 'Buyer', description: 'Looking to purchase property' },
    { value: 'tenant', label: 'Tenant', description: 'Looking to rent property' },
    { value: 'landlord', label: 'Landlord', description: 'I own and rent out property' },
    { value: 'seller', label: 'Seller', description: 'Looking to sell property' },
    { value: 'agent', label: 'Agent', description: 'Professional real estate agent' },
    { value: 'investor', label: 'Investor', description: 'Property investment focus' },
    { value: 'property-manager', label: 'Property Manager', description: 'Manage homes, tenants and maintenance' },
    { value: 'professional', label: 'Professional', description: 'Offer legal, valuation or property services' },
];
export default function AuthModal({ onClose, onSignIn, initialMode = 'signin' }) {
    const [mode, setMode] = useState(initialMode);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [pendingAccount, setPendingAccount] = useState(null);
    const [verificationDocument, setVerificationDocument] = useState(null);
    const [googleRegistration, setGoogleRegistration] = useState(false);
    const requiresVerification = selectedRole !== 'buyer';
    const startGoogleRegistration = () => {
        setMode('register');
        setStep(2);
        setGoogleRegistration(true);
        setName('Google User');
        setUsername(suggestUsername('Google User'));
        setEmail(`google.user.${Date.now()}@stara.local`);
        setPhone('+254 700 000 000');
        setPassword('');
        setConfirmPassword('');
        setSelectedRole('');
        setError('Choose your STARA role to continue with Google registration.');
    };
    const readAccounts = () => {
        try {
            const stored = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    };
    const saveAccount = (account) => {
        const accounts = readAccounts().filter(existing => existing.email !== account.email);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
    };
    const saveEmail = (message) => {
        const outbox = JSON.parse(localStorage.getItem(EMAIL_OUTBOX_KEY) || '[]');
        localStorage.setItem(EMAIL_OUTBOX_KEY, JSON.stringify([{ ...message, sentAt: new Date().toISOString() }, ...outbox]));
    };
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 1000));
        const account = readAccounts().find(candidate => candidate.email === email.trim().toLowerCase());
        setLoading(false);
        if (!account) {
            setMode('register');
            setStep(1);
            setConfirmPassword('');
            setSelectedRole('');
            setError('This email is not registered. Please complete registration first.');
            return;
        }
        if (account.password !== password) {
            setError('The password is incorrect. Please try again.');
            return;
        }
        if (!account.emailVerified) {
            setPendingAccount(account);
            setMode('verify');
            setError('');
            return;
        }
        onSignIn({ ...MOCK_USER, ...account, email: account.email });
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        if (step === 1 && !googleRegistration) {
            if (!name || !email || !phone || !password || !confirmPassword) {
                setError('Please complete all account fields.');
                return;
            }
            if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (readAccounts().some(account => account.email === email.trim().toLowerCase())) {
                setError('An account with this email already exists. Please sign in instead.');
                return;
            }
            setError('');
            setStep(2);
            return;
        }
        if (step === 2 && !selectedRole) {
            setError('Choose a role before continuing.');
            return;
        }
        if (step === 2 && googleRegistration) {
            if (!username.trim()) {
                setError('Enter a username before continuing.');
                return;
            }
            if (readAccounts().some(account => account.username === username.trim().toLowerCase())) {
                setError('That username is already in use. Choose another one.');
                return;
            }
        }
        if (step === 2 && requiresVerification) {
            setError('');
            setStep(3);
            return;
        }
        if (step === 3 && !verificationDocument) {
            setError('Upload a verification document before creating this account.');
            return;
        }
        setLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        const account = {
            ...MOCK_USER,
            id: `user-${Date.now()}`,
            name,
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            phone,
            role: selectedRole,
            verified: false,
            password: googleRegistration ? null : password,
            authProvider: googleRegistration ? 'google' : 'password',
            emailVerified: googleRegistration,
            emailVerificationToken: `verify-${Date.now()}`,
            initialVerification: requiresVerification
                ? { email: 'not_started', phone: 'not_started', identity: 'submitted', professional: ['agent', 'property-manager', 'professional'].includes(selectedRole) ? 'submitted' : 'not_applicable' }
                : { email: 'not_started', phone: 'not_started', identity: 'not_applicable', professional: 'not_applicable' },
            initialVerificationDocuments: requiresVerification ? {
                identity: {
                    name: verificationDocument.name,
                    size: verificationDocument.size,
                    submittedAt: new Date().toISOString(),
                },
            } : {},
        };
        saveAccount(account);
        saveEmail({
            to: account.email,
            subject: 'Verify your STARA email address',
            type: 'email-verification',
            body: `Welcome to STARA, ${account.name}. Verify your email to activate your account.`,
            token: account.emailVerificationToken,
        });
        saveEmail({
            to: account.email,
            subject: 'Welcome to the STARA community',
            type: 'welcome',
            body: `Welcome to STARA, ${account.name}. Your property journey across Kenya starts here.`,
        });
        setPendingAccount(account);
        if (googleRegistration) {
            onSignIn(account);
            return;
        }
        setMode('verify');
    };
    const handleForgot = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email.');
            return;
        }
        setLoading(true);
        const account = readAccounts().find(candidate => candidate.email === email.trim().toLowerCase());
        if (!account) {
            setLoading(false);
            setError('No account is registered with this email. Please register first.');
            return;
        }
        const resetToken = `reset-${Date.now()}`;
        saveAccount({ ...account, resetToken, resetExpires: Date.now() + 15 * 60 * 1000 });
        saveEmail({
            to: account.email,
            subject: 'Reset your STARA password',
            type: 'password-reset',
            body: 'Use the secure reset link to create a new STARA password.',
            token: resetToken,
        });
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setForgotSent(true);
    };
    const handleResetPassword = (e) => {
        e.preventDefault();
        if (resetPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (resetPassword !== resetConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        const account = readAccounts().find(candidate => candidate.email === email.trim().toLowerCase());
        if (!account || !account.resetToken || account.resetExpires < Date.now()) {
            setError('This reset request has expired. Please request a new link.');
            return;
        }
        saveAccount({ ...account, password: resetPassword, resetToken: null, resetExpires: null });
        setMode('reset-success');
        setForgotSent(false);
        setPassword('');
        setResetPassword('');
        setResetConfirmPassword('');
        setError('');
    };
    const verifyPendingEmail = () => {
        if (!pendingAccount) return;
        const verifiedAccount = { ...pendingAccount, emailVerified: true, emailVerificationToken: null };
        saveAccount(verifiedAccount);
        setPendingAccount(verifiedAccount);
        onSignIn({ ...MOCK_USER, ...verifiedAccount, email: verifiedAccount.email });
    };
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget)
        onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#F5F4F0]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L18 8V18H12V12H8V18H2V8L10 2Z" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-[#1C1917] tracking-tight">STARA</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#78716C] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-bold text-[#1C1917]">
            {mode === 'signin' ? 'Welcome back' : mode === 'forgot' ? 'Reset password' : mode === 'reset' ? 'Create a new password' : mode === 'reset-success' ? 'Password updated' : mode === 'verify' ? 'Verify your email' : step === 1 ? 'Create your account' : step === 2 ? 'Choose your role' : 'Upload verification document'}
          </h2>
          <p className="text-sm text-[#78716C] mt-0.5">
            {mode === 'signin' ? 'Sign in to your STARA account' : mode === 'forgot' ? 'We\'ll send you a reset link' : mode === 'reset' ? 'Use the secure link sent to your email' : mode === 'reset-success' ? 'Your STARA password has been changed successfully' : mode === 'verify' ? 'Check your inbox to activate your STARA account' : step === 1 ? 'Join Kenya\'s premier property platform' : step === 2 ? 'Select your primary role on STARA' : 'Your account will remain pending until STARA reviews it'}
          </p>
        </div>

        <div className="px-6 py-5">
          {/* Google Sign In */}
          {mode === 'signin' && (<button type="button" onClick={startGoogleRegistration} className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#E7E5E0] rounded-xl hover:bg-[#F5F4F0] transition-colors mb-4 text-sm font-medium text-[#1C1917]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Register with Google
            </button>)}

          {mode === 'signin' && (<div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#E7E5E0]"/>
              <span className="text-xs text-[#A8A29E]">or with email</span>
              <div className="flex-1 h-px bg-[#E7E5E0]"/>
            </div>)}

          {/* Forgot Password */}
          {mode === 'forgot' && (<form onSubmit={handleForgot} className="space-y-4">
              {forgotSent ? (<div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-[#1C1917]">Reset link sent!</p>
                  <p className="text-sm text-[#78716C] mt-1">Check your email at {email}</p>
                  <button type="button" onClick={() => setMode('reset')} className="mt-4 text-sm font-medium text-[#E85D04]">I opened the email — create new password</button>
                </div>) : (<>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="you@email.com"/>
                  </div>
                  {error && <p className="text-sm text-[#DC2626]">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white rounded-xl transition-all hover:shadow-lg disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="w-full text-center text-sm text-[#78716C] hover:text-[#E85D04]">Back to sign in</button>
                </>)}
            </form>)}

          {mode === 'reset-success' && (<div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p className="font-semibold text-[#1C1917]">Password updated successfully</p>
              <p className="text-sm text-[#78716C] mt-1">Your new password is ready. Return to STARA Login to continue.</p>
              <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="w-full mt-5 py-3 font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>Return to STARA Login</button>
            </div>)}

          {mode === 'reset' && (<form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-[#57534E]">A reset link was sent to <strong>{email}</strong>. This demo opens the secure reset form below.</p>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1.5">New password</label>
                <input type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="Min. 8 characters"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Confirm new password</label>
                <input type="password" value={resetConfirmPassword} onChange={e => setResetConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04]" placeholder="Re-enter your password"/>
              </div>
              {error && <p className="text-sm text-[#DC2626]">{error}</p>}
              <button type="submit" className="w-full py-3 font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>Update password</button>
              <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="w-full text-center text-sm text-[#78716C] hover:text-[#E85D04]">Back to sign in</button>
            </form>)}

          {mode === 'verify' && (<div className="space-y-4">
              <div className="rounded-xl bg-[#FFF7F0] p-4">
                <p className="text-sm font-semibold text-[#1C1917]">Verification email sent</p>
                <p className="text-sm text-[#78716C] mt-1">We sent an email to {pendingAccount?.email}. Open the verification link to activate your account and receive your STARA welcome message.</p>
              </div>
              <button type="button" onClick={verifyPendingEmail} className="w-full py-3 font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>Verify email and continue</button>
              <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="w-full text-center text-sm text-[#78716C] hover:text-[#E85D04]">Back to sign in</button>
            </div>)}

          {/* Sign In */}
          {mode === 'signin' && (<form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="you@email.com"/>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#1C1917]">Password</label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs text-[#E85D04] hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-16 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="••••••••"/>
                  <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E85D04]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      {showPassword ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 102.83 2.83"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.24A9.77 9.77 0 0112 4c5.05 0 8.27 4.42 9 6a16.72 16.72 0 01-3.02 3.94M6.61 6.61C4.55 7.96 3.3 9.72 3 10c.73 1.58 3.95 6 9 6 1.15 0 2.2-.2 3.14-.52"/></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.46 12S5.64 5 12 5s9.54 7 9.54 7-3.18 7-9.54 7-9.54-7-9.54-7z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-[#DC2626]">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white rounded-xl transition-all hover:shadow-lg disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-sm text-[#78716C]">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setStep(1); setGoogleRegistration(false); setSelectedRole(''); setError(''); }} className="font-semibold text-[#E85D04] hover:underline">Register</button>
              </p>
            </form>)}

          {/* Register */}
          {mode === 'register' && (<form onSubmit={handleRegister} className="space-y-4">
              {step === 1 ? (<>
                  <button type="button" onClick={startGoogleRegistration} className="w-full py-2.5 border border-[#E7E5E0] rounded-xl text-sm font-semibold text-[#1C1917] hover:bg-[#F5F4F0] transition-colors">
                    Register with Google
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#E7E5E0]" />
                    <span className="text-xs text-[#A8A29E]">or with email</span>
                    <div className="flex-1 h-px bg-[#E7E5E0]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Full name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="Your full name"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="you@email.com"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Phone number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="+254 700 000 000"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-16 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="Min. 8 characters"/>
                      <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E85D04]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          {showPassword ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 102.83 2.83"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.24A9.77 9.77 0 0112 4c5.05 0 8.27 4.42 9 6a16.72 16.72 0 01-3.02 3.94M6.61 6.61C4.55 7.96 3.3 9.72 3 10c.73 1.58 3.95 6 9 6 1.15 0 2.2-.2 3.14-.52"/></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.46 12S5.64 5 12 5s9.54 7 9.54 7-3.18 7-9.54 7-9.54-7-9.54-7z"/><circle cx="12" cy="12" r="3"/></>}
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Confirm password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 pr-16 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="Re-enter your password"/>
                      <button type="button" onClick={() => setShowConfirmPassword(value => !value)} aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} title={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E85D04]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          {showConfirmPassword ? <><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/><path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 102.83 2.83"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.88 4.24A9.77 9.77 0 0112 4c5.05 0 8.27 4.42 9 6a16.72 16.72 0 01-3.02 3.94M6.61 6.61C4.55 7.96 3.3 9.72 3 10c.73 1.58 3.95 6 9 6 1.15 0 2.2-.2 3.14-.52"/></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.46 12S5.64 5 12 5s9.54 7 9.54 7-3.18 7-9.54 7-9.54-7-9.54-7z"/><circle cx="12" cy="12" r="3"/></>}
                        </svg>
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-[#DC2626]">{error}</p>}
                  <button type="submit" className="w-full py-3 font-semibold text-white rounded-xl transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    Continue
                  </button>
                  <p className="text-center text-sm text-[#78716C]">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setMode('signin'); setGoogleRegistration(false); setError(''); }} className="font-semibold text-[#E85D04] hover:underline">Sign In</button>
                  </p>
                </>) : step === 2 ? (<>
                  {googleRegistration && (<div className="rounded-xl bg-[#FFF7F0] p-3 mb-3 text-xs text-[#57534E]">Google profile ready. Choose your STARA role to finish registration.</div>)}
                  {googleRegistration && (<div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Suggested username</label>
                    <input type="text" value={username} onChange={event => setUsername(event.target.value.replace(/\s+/g, '.').toLowerCase())} className="w-full px-4 py-2.5 border border-[#E7E5E0] rounded-xl text-sm focus:outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" placeholder="your.username"/>
                    <p className="text-xs text-[#78716C] mt-1">Suggested from your Google account name. You can edit it before continuing.</p>
                  </div>)}
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                    {ROLES.map((role) => (<button key={role.value} type="button" onClick={() => { setSelectedRole(role.value); setVerificationDocument(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${selectedRole === role.value ? 'border-[#E85D04] bg-[#FFF7F0]' : 'border-[#E7E5E0] hover:border-[#E85D04]/40'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedRole === role.value ? 'border-[#E85D04]' : 'border-[#D6D3CD]'}`}>
                          {selectedRole === role.value && <div className="w-2 h-2 rounded-full bg-[#E85D04]"/>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1C1917]">{role.label}</p>
                          <p className="text-xs text-[#78716C]">{role.description}</p>
                        </div>
                      </button>))}
                  </div>
                  {error && <p className="text-sm text-[#DC2626]">{error}</p>}
                  <button type="submit" className="w-full py-3 font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    {requiresVerification ? 'Continue to verification' : 'Create Account'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-[#78716C] hover:text-[#E85D04]">Back</button>
                </>) : (<>
                  <div className="rounded-xl bg-[#FFF7F0] p-4">
                    <p className="text-sm font-semibold text-[#1C1917]">Verification is required for {ROLES.find(role => role.value === selectedRole)?.label} accounts.</p>
                    <p className="text-xs text-[#78716C] mt-1">Upload a clear government or professional document. STARA will review it before verification is approved.</p>
                  </div>
                  <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#D6D3CD] p-6 text-center hover:border-[#E85D04]">
                    <span className="text-sm font-semibold text-[#57534E]">{verificationDocument ? verificationDocument.name : 'Choose verification document'}</span>
                    <span className="block text-xs text-[#A8A29E] mt-1">PDF, JPG, JPEG or PNG</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => { setVerificationDocument(event.target.files?.[0] || null); setError(''); }} className="sr-only"/>
                  </label>
                  {error && <p className="text-sm text-[#DC2626]">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white rounded-xl disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #E85D04, #F4A100)' }}>
                    {loading ? 'Submitting for review...' : 'Submit and create account'}
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="w-full text-center text-sm text-[#78716C] hover:text-[#E85D04]">Back</button>
                </>)}
            </form>)}

          {mode === 'register' && step !== 1 && (<p className="text-center text-sm text-[#78716C] mt-4">
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('signin'); setStep(1); setGoogleRegistration(false); setError(''); }} className="font-semibold text-[#E85D04] hover:underline">
                Log in
              </button>
            </p>)}

          <p className="text-xs text-[#A8A29E] text-center mt-4">
            By continuing you agree to STARA&apos;s{' '}
            <button className="text-[#E85D04] hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-[#E85D04] hover:underline">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>);
}
