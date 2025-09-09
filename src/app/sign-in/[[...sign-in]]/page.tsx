import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Sign in to your account to continue
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              card: "shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
              headerTitle: "text-slate-900 dark:text-white",
              headerSubtitle: "text-slate-600 dark:text-slate-300",
              socialButtonsBlockButton:
                "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
              formFieldInput:
                "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400",
              footerActionLink:
                "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
            },
          }}
        />
      </div>
    </div>
  );
}
