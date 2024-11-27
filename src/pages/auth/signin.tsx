import { GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';

interface SignInProps {
  providers: any;
}

export default function SignIn({ providers }: SignInProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (providerId: string) => {
    try {
      const result = await signIn(providerId, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {Object.values(providers).map((provider: any) => (
              <button
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {provider.name === 'Google' && <FaGoogle className="mr-2" />}
                {provider.name === 'GitHub' && <FaGithub className="mr-2" />}
                Sign in with {provider.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const providers = await getProviders();
    return {
      props: { providers: providers ?? {} },
    };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return {
      props: { providers: {} },
    };
  }
};
