import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; 

const sideImageUrl = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const { register } = useAuth();
  const { addNotification } = useNotification(); 
  const navigate = useNavigate();

  useEffect(() => {
    const { password } = formData;
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
    });
  }, [formData.password]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      addNotification('Please ensure your password meets all requirements.', 'error'); 
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      addNotification('Registration successful! Welcome.', 'success'); 
      navigate('/');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to register.', 'error'); 
    } finally {
      setLoading(false);
    }
  };

  const renderValidationCheck = (isValid, text) => (
    <li className={`flex items-center gap-2 ${isValid ? 'text-success' : 'text-base-content/50'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isValid ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
      </svg>
      <span>{text}</span>
    </li>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-base-100 rounded-2xl shadow-2xl">
        
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${sideImageUrl})` }}></div>

        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-3xl font-bold text-center text-primary">Create an Account</h2>
          <p className="mt-2 text-center text-base-content/70">Join Evently and start discovering amazing events!</p>
          
          <form className="mt-6" onSubmit={handleSubmit}>
            
            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">First Name</span></label>
                <input type="text" name="firstName" placeholder="John" className="input input-bordered input-primary w-full" required onChange={handleChange} />
              </div>
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Last Name</span></label>
                <input type="text" name="lastName" placeholder="Doe" className="input input-bordered input-primary w-full" required onChange={handleChange} />
              </div>
            </div>

            <div className="mt-2 form-control">
              <label className="label"><span className="label-text">Email Address</span></label>
              <input type="email" name="email" placeholder="you@example.com" className="input input-bordered input-primary w-full " required onChange={handleChange} />
            </div>
            
            <div className="mt-2 form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" name="password" placeholder="Enter a secure password" className="input input-bordered input-primary w-full" required onChange={handleChange} />
            </div>

            <ul className="mt-4 text-xs space-y-1">
              {renderValidationCheck(passwordValidation.minLength, 'At least 8 characters')}
              {renderValidationCheck(passwordValidation.hasUpper, 'At least one uppercase letter (A-Z)')}
              {renderValidationCheck(passwordValidation.hasLower, 'At least one lowercase letter (a-z)')}
              {renderValidationCheck(passwordValidation.hasNumber, 'At least one number (0-9)')}
              {renderValidationCheck(passwordValidation.hasSpecial, 'At least one special character (@, $, !, etc.)')}
            </ul>
            
            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-base-content/70">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;