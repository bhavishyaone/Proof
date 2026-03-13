import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import VideoRecordingModal from "./VideoRecordingModal.jsx";
import TextTestimonialModal from "./TextTestimonialModal.jsx";

export default function PublicTestimonial() {
  const { spaceSlug } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/public/${spaceSlug}`
        );
        setSpace(res.data.workspace);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else console.error("Failed to load space:", err);
      } finally {
        setLoading(false);
      }
    };
    if (spaceSlug) fetchSpace();
  }, [spaceSlug]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }


  if (notFound || !space) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
        <p className="text-gray-400 text-lg">This space doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-gray-500 hover:text-white underline underline-offset-4 transition-colors"
        >
          Go home
        </button>
      </div>
    );
  }

  const theme = space.theme || "dark";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-[#0A0A0A]" : "bg-gray-50"}`}>

      <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />

      <div className="absolute top-8 left-8">
        <a href="/" className="block hover:opacity-80 transition-opacity">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Proof</h1>
        </a>
      </div>

      <div className={`w-full max-w-2xl border rounded-2xl p-8 md:p-12 flex flex-col items-center text-center relative z-10 shadow-2xl transition-colors duration-300 ${theme === "dark" ? "bg-[#1A1A1A] border-[#2A2A2A]" : "bg-white border-gray-100"}`}>


        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-inner border transition-colors duration-300 overflow-hidden ${theme === "dark" ? "bg-[#2A2A2A] text-white border-[#3A3A3A]" : "bg-gray-100 text-gray-900 border-gray-200"}`}>
          {space.logo ? (
            <img src={space.logo} alt={space.name} className="w-full h-full object-cover" />
          ) : (
            (space.name || "?").charAt(0).toUpperCase()
          )}
        </div>


        <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {space.headerTitle || space.name}
        </h2>


        <p className={`text-base md:text-lg mb-10 max-w-md leading-relaxed ${theme === "dark" ? "text-[#888888]" : "text-gray-500"}`}>
          {space.customMessage || "Would you like to give a shoutout? Your feedback helps us grow."}
        </p>

        <div className={`w-full border rounded-xl p-6 mb-10 text-left transition-colors duration-300 ${theme === "dark" ? "bg-[#111111] border-[#222222]" : "bg-gray-50 border-gray-100"}`}>
          <p className={`text-xs font-black tracking-[0.2em] uppercase mb-4 ${theme === "dark" ? "text-[#666666]" : "text-gray-400"}`}>Questions</p>
          <ul className={`space-y-4 text-sm font-medium ${theme === "dark" ? "text-[#CCCCCC]" : "text-gray-600"}`}>
            <li className="flex items-start gap-3">
              <span className={`text-lg leading-none mt-0.5 ${theme === "dark" ? "text-[#444444]" : "text-gray-300"}`}>•</span>
              Who are you / what are you working on?
            </li>
            <li className="flex items-start gap-3">
              <span className={`text-lg leading-none mt-0.5 ${theme === "dark" ? "text-[#444444]" : "text-gray-300"}`}>•</span>
              How has our product helped you?
            </li>
            <li className="flex items-start gap-3">
              <span className={`text-lg leading-none mt-0.5 ${theme === "dark" ? "text-[#444444]" : "text-gray-300"}`}>•</span>
              What is the best thing about our product?
            </li >
            <li className="flex items-start gap-3">
              <span className={`text-lg leading-none mt-0.5 ${theme === "dark" ? "text-[#444444]" : "text-gray-300"}`}>•</span>
              What we can improve in our Product?
            </li >


          </ul>
        </div>


        <div className="w-full space-y-3">
          {space.collectionType !== "text" && (
            <Button
              onClick={() => setIsVideoModalOpen(true)}
              className={`w-full text-base font-bold py-6 rounded-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-3 ${theme === "dark" ? "bg-white hover:bg-gray-100 text-black" : "bg-[#5D5FEF] hover:bg-[#4F51D6] text-white"}`}
            >
              <Video className="w-5 h-5" /> Record a video
            </Button>
          )}
          {space.collectionType !== "video" && (
            <Button
              variant="outline"
              onClick={() => setIsTextModalOpen(true)}
              className={`w-full border text-base font-bold py-6 rounded-lg transition-colors flex items-center justify-center gap-3 ${theme === "dark" ? "bg-[#151515] hover:bg-[#222222] border-[#333333] text-white hover:text-white" : "bg-white hover:bg-gray-50 border-gray-200 text-gray-900 hover:text-gray-900"}`}
            >
              <Edit3 className={`w-5 h-5 ${theme === "dark" ? "text-[#888]" : "text-gray-500"}`} /> Send in text
            </Button>
          )}
        </div>

      </div>

      <div className={`absolute bottom-8 flex gap-1 items-center text-[10px] tracking-widest font-medium uppercase mt-8 z-10 ${theme === "dark" ? "text-[#666666]" : "text-gray-400"}`}>
        POWERED BY <span className={`font-bold ml-1 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>PROOF</span>
      </div>

      {isVideoModalOpen && (
        <VideoRecordingModal
          onClose={() => setIsVideoModalOpen(false)}
          spaceSlug={spaceSlug}
          space={space}
        />
      )}

      {isTextModalOpen && (
        <TextTestimonialModal
          onClose={() => setIsTextModalOpen(false)}
          spaceSlug={spaceSlug}
          space={space}
        />
      )}

    </div>
  );
}
