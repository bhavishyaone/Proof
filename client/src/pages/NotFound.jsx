import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "../analytics.jsx";

export default function NotFound() {
  React.useEffect(() => {
    track("404_page_view", { url: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto">

        <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-8 shadow-xl">
          <Ghost className="w-9 h-9 text-gray-400" />
        </div>


        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">
          404 — Page Not Found
        </p>


        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Nothing here.
        </h1>


        <p className="text-[#6B6B6B] text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist, was moved, or you mistyped the URL.
        </p>


        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-5 rounded-xl flex items-center gap-2 shadow-lg">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
