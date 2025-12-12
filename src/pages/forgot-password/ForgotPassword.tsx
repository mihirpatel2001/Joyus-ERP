import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowLeft, Smartphone, ShieldCheck, Lock, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { OtpInput } from '../../components/ui/OtpInput';
import { useToast } from '../../context/ToastContext';

type Step = 'identity' | 'otp' | 'reset';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('identity');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [identity, setIdentity] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Timer State
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- Handlers ---

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) {
      showToast('Please enter your email or mobile number', 'error');
      return;
    }

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
      setCanResend(false);
      showToast(`OTP sent to ${identity}`, 'success');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast('Please enter a complete 6-digit code', 'error');
      return;
    }

    setLoading(true);
    // Simulate Verification
    setTimeout(() => {
      setLoading(false);
      if (otp === '123456') {
        setStep('reset');
        showToast('Identity verified successfully', 'success');
      } else {
        showToast('Invalid OTP code. Try 123456', 'error');
        setOtp('');
      }
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    // Simulate Password Update
    setTimeout(() => {
      setLoading(false);
      showToast('Password reset successfully! Please login.', 'success');
      navigate('/login');
    }, 1000);
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    showToast('New code sent!', 'info');
  };

  // --- Render Steps ---

  const renderIdentityStep = () => (
    <form onSubmit={handleSendOtp} className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-content-strong">Forgot Password?</h2>
        <p className="text-content-sub mt-2 text-sm">
          Enter your registered email or mobile number to receive a verification code.
        </p>
      </div>

      <div className="space-y-6">
        <Input
          label="Email or Mobile Number"
          placeholder="e.g. name@company.com or 9876543210"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          type="text"
        />
        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Send Verification Code
        </Button>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-4">
          <Smartphone className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-content-strong">Verify Identity</h2>
        <p className="text-content-sub mt-2 text-sm">
          Enter the 6-digit code sent to <br/>
          <span className="font-semibold text-content-strong">{identity}</span>
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-center">
          <OtpInput 
            value={otp} 
            onChange={setOtp} 
            error={false}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Verify & Proceed
        </Button>

        <div className="text-center text-sm">
          {canResend ? (
            <button 
              type="button" 
              onClick={handleResend}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-content-sub">
              Resend code in <span className="font-mono font-medium text-content-strong">00:{timer.toString().padStart(2, '0')}</span>
            </p>
          )}
        </div>
      </div>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-content-strong">Reset Password</h2>
        <p className="text-content-sub mt-2 text-sm">
          Your identity has been verified. Create a new strong password.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
          Reset Password
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-surface rounded-xl shadow-md">
            <Hexagon className="w-10 h-10 text-primary-600 fill-primary-50" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-divider p-8 relative overflow-hidden">
          
          {/* Back Button (Only for Identity Step) */}
          {step === 'identity' && (
            <button 
              onClick={() => navigate('/login')}
              className="absolute top-6 left-6 text-content-sub hover:text-content-strong transition-colors"
              title="Back to Login"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {/* Back Button (For OTP Step -> Identity) */}
          {step === 'otp' && (
            <button 
              onClick={() => { setStep('identity'); setOtp(''); }}
              className="absolute top-6 left-6 text-content-sub hover:text-content-strong transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {step === 'identity' && renderIdentityStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'reset' && renderResetStep()}

        </div>
        
        {/* Footer Link */}
        {step !== 'identity' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm text-content-sub hover:text-primary-600 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};