import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'Configuration' && (
              <>
                There is a problem with the server configuration.
                <br />
                Check if all environment variables are properly set.
              </>
            )}
            {error === 'AccessDenied' && (
              <>
                Access denied. You are not authorized to sign in.
              </>
            )}
            {error === 'Verification' && (
              <>
                The sign in link is no longer valid.
                <br />
                It may have been used already or it may have expired.
              </>
            )}
            {!error && 'An error occurred during authentication.'}
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
