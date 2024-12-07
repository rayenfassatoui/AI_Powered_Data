import { GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Log the environment
      console.log('Environment:', {
        hasGoogleId: !!process.env.NEXT_PUBLIC_GOOGLE_ID,
        hasGoogleSecret: !!process.env.NEXT_PUBLIC_GOOGLE_SECRET,
        nodeEnv: process.env.NODE_ENV
      });

      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false
      });

      console.log('Sign-in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        if (result.error === 'Configuration') {
          setError('OAuth configuration error. Please contact support.');
        } else {
          setError(`Authentication failed: ${result.error}`);
        }
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <FaGoogle className="mr-2" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers: providers ?? {} },
  };
};
