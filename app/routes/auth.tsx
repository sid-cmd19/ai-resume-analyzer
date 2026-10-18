import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMate | Auth" },
    {
      name: "description",
      content: "Sign into your account.",
    },
  ];
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);
  return (
    <main className="bg-[url('/images/bg-auth.svg)] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome to ResuMate ..!</h1>
            <h2 className="">Sign in to Continue Your Job journey</h2>
          </div>
          <div className="">
            {isLoading ? (
              <button
                className="auth-button animate-pulse cursor-wait"
                disabled
              >
                <p className="">Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Sign Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log in</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
