import Navbar from "~/components/Navbar";
import { type SubmitEvent, useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { generateUuid } from "~/lib/utils";
import { prepareInstructions } from "~/constants";

interface HandleAnalyze {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File | null;
}

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: HandleAnalyze) => {

    setIsProcessing(true);
    setStatusText("Uploading thr file...");

    const uploadedFile = await fs.upload([file as File]);
    if (!uploadedFile)
      return setStatusText("Error: Uploading failed. Please try again.");

    setStatusText("Converting to Image...");
    const imageFile = await convertPdfToImage(file as File);
    if (!imageFile?.file)
      return setStatusText(
        "Error: PDF to Image conversion failed. Please try again.",
      );

    setStatusText("Uploading image file...");
    const uploadedImageFile = await fs.upload([imageFile.file]);
    if (!uploadedImageFile)
      return setStatusText("Error: Uploading failed. Please try again.");

    setStatusText("Preparing data for AI...");
    const uuid = generateUuid();

    const data = {
      id: uuid,
      companyName,
      jobTitle,
      jobDescription,
      imagePath: uploadedImageFile.path,
      resumePath: uploadedFile.path,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("All set... Analyzing...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
      }),
    );

    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    
    data.feedback = JSON.parse(feedbackText);

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing complete, redirecting...")
    // setIsProcessing(false);
    navigate(`/resume/${uuid}`)
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form || !file) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    handleAnalyze({
      companyName: companyName as string,
      jobTitle: jobTitle as string,
      jobDescription: jobDescription as string,
      file: file,
    });
  };


  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="resume scan"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score & improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={7}
                  name="job-description"
                  placeholder="Job description"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                />
              </div>
              <button
                type="submit"
                className={`primary-button cursor-${file ? "pointer" : "not-allowed"}`}
                disabled={file ? false : true}
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
