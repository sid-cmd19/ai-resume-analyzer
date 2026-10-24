import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
// import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

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
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState<boolean>(true);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setIsLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const paresedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );
      console.log("paresedResumes in useEffect in loadResumes", paresedResumes);
      setResumes(paresedResumes ?? []);
      setIsLoadingResumes(false);
    };
    loadResumes();
  }, []);

  if (!auth.isAuthenticated) return <div>Loading...</div>;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section py-16">
        <div className="page-heading"></div>
        <h1>Track your Apps & Resume ratings</h1>
        {!isLoadingResumes && resumes.length === 0 ? (
          <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ) : (
          <h2>Review your sub,issions & check AI-Powered feedback</h2>
        )}
        {isLoadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              alt="resume-scan-loader"
              className="w-[200]"
            />
          </div>
        )}

        {!isLoadingResumes && resumes.length && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard resume={resume} key={resume.id} />
            ))}
          </div>
        )}

        {!isLoadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
