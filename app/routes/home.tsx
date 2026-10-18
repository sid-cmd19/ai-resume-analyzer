import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMate" },
    {
      name: "description",
      content: "Smart feedback, Smart improvements, Better resumes.",
    },
  ];
}

export default function Home() {

  const {auth} = usePuterStore()
  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  if(!auth.isAuthenticated) return <div>Loading...</div>;
  
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section py-16">
        <div className="page-heading"></div>
        <h1>Track your Apps & Resume ratings</h1>
        <h2>Review your sub,issions & check AI-Powered feedback</h2>

        {resumes.length && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard resume={resume} key={resume.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
