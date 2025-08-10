import { Link } from 'react-router-dom';

const CheckEmailPage = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Registration Successful!</h1>
      <p className="mt-4 text-lg">Please check your email to complete the verification process.</p>
      <Link to="/login" className="btn btn-primary mt-6">Go to Login</Link>
    </div>
  );
};

export default CheckEmailPage;