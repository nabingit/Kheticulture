import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from '../components/LanguageToggle';
import { useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, MapPin, Calendar, Phone } from 'lucide-react';

export function AuthPage() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    userType: 'worker' as 'farmer' | 'worker',
    location: '',
    dateOfBirth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getMaxDate = (): string => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  const formatContactNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format as XXX-XXX-XXXX if more than 6 digits, or XXX-XXX if more than 3 digits
    if (limitedDigits.length > 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    } else if (limitedDigits.length > 3) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    }
    return limitedDigits;
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('One special character (!@#$%^&*...)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    
    if (!isLogin && newPassword) {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        setPasswordError(`Password must contain: ${validation.errors.join(', ')}`);
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatContactNumber(e.target.value);
    setFormData({ ...formData, contactNumber: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password');
        }
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          return;
        }

        if (!formData.contactNumber.trim()) {
          setError('Contact number is required');
          return;
        }

        // Validate password complexity for signup
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          setError(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
          return;
        }

        // Validate worker-specific fields
        if (formData.userType === 'worker') {
          if (!formData.location.trim()) {
            setError('Location is required for workers');
            return;
          }
          
          if (!formData.dateOfBirth) {
            setError('Date of birth is required for workers');
            return;
          }

          const age = calculateAge(formData.dateOfBirth);
          if (age < 16) {
            setError('Workers must be at least 16 years old to register');
            return;
          }
        }

        const result = await signup(
          formData.name, 
          formData.email, 
          formData.password, 
          formData.contactNumber,
          formData.userType,
          formData.userType === 'worker' ? formData.location : undefined,
          formData.userType === 'worker' ? formData.dateOfBirth : undefined
        );
        
        if (!result.success) {
          setError(result.error || 'Registration failed');
        } else {
          success = true;
        }
      }

      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (newUserType: 'farmer' | 'worker') => {
    setFormData({ 
      ...formData, 
      userType: newUserType,
      // Clear worker-specific fields when switching to farmer
      location: newUserType === 'farmer' ? '' : formData.location,
      dateOfBirth: newUserType === 'farmer' ? '' : formData.dateOfBirth
    });
    setError(''); // Clear any existing errors
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Sprout className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('appName')}</h1>
          <p className="text-gray-600">{t('appTagline')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-lg transition-colors ${
                isLogin ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-lg transition-colors ${
                !isLogin ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {t('signUp')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('enterFullName')}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('enterEmail')}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactNumber')} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleContactNumberChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder=""
                    maxLength={12} // XXX-XXX-XXXX format
                    required
                  />
                </div>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')} * {!isLogin && <span className="text-xs text-gray-500"></span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  placeholder={isLogin ? t('enterPassword') : t('createStrongPassword')}
                  required
                  minLength={isLogin ? undefined : 8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {!isLogin && formData.password && (
                <div className="mt-2">
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      कम्तिमा ८ अक्षर
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      एक ठूलो अक्षर
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      एक सानो अक्षर
                    </div>
                    <div className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      एक संख्या
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      एक विशेष अक्षर
                    </div>
                  </div>
                </div>
              )}
              
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('iAm')} *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="farmer"
                        checked={formData.userType === 'farmer'}
                        onChange={(e) => handleUserTypeChange(e.target.value as 'farmer' | 'worker')}
                        className="sr-only"
                      />
                      <div className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                        formData.userType === 'farmer' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-green-300'
                      }`}>
                        <div className="font-medium">{t('farmer')}</div>
                        <div className="text-xs text-gray-600">{t('postJobs')}</div>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="worker"
                        checked={formData.userType === 'worker'}
                        onChange={(e) => handleUserTypeChange(e.target.value as 'farmer' | 'worker')}
                        className="sr-only"
                      />
                      <div className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                        formData.userType === 'worker' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-green-300'
                      }`}>
                        <div className="font-medium">{t('worker')}</div>
                        <div className="text-xs text-gray-600">{t('findJobs')}</div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.userType === 'worker' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('location')} *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t('villageTownDistrict')}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('dateOfBirth')} *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          max={getMaxDate()}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('mustBe16')}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('pleaseWait') : isLogin ? t('login') : t('createAccount')}
            </button>
          </form>
        </div>
        
        {/* Subtle Bolt.new Attribution */}
        <div className="mt-6 text-center">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center text-xs text-gray-400 hover:text-green-600 transition-colors duration-200"
          >
            <span className="mr-1.5">Crafted with</span>
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-sm flex items-center justify-center mr-1.5 group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-[8px] font-bold">⚡</span>
              </div>
            </div>
            <span className="font-medium group-hover:underline">bolt.new</span>
          </a>
        </div>
      </div>
    </div>
  );
}