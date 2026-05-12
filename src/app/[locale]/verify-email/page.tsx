import { Link } from '@/i18n/navigation';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50">
          <svg className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="mb-2 text-gray-500">
          We've sent a verification link to your email address.
        </p>
        <p className="mb-8 text-sm text-gray-400">
          Click the link in the email to activate your account. After verifying, you'll complete your profile setup.
        </p>

        <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-6 text-left">
          <p className="mb-3 text-sm font-semibold text-gray-700">What happens next?</p>
          <ol className="space-y-2 text-sm text-gray-500">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">1</span>
              Check your inbox for an email from MUGOONG
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">2</span>
              Click the verification link
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">3</span>
              Complete your profile and select your interests
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-400">
          Didn't receive it? Check your spam folder or{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
