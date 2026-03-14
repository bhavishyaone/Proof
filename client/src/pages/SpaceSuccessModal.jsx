import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpaceContext } from "../context/SpaceContext";
import { track } from "../analytics.jsx";

export default function SpaceSuccessModal() {
  const [copied, setCopied] = useState(false);
  const { activeSpace } = useContext(SpaceContext);
  const navigate = useNavigate();

  const spaceName = activeSpace?.name || "Your Space";
  const publicUrl = `${window.location.origin}/${activeSpace?.slug || ""}`;

  React.useEffect(() => {
    track("space_success_modal_view");
  }, []);

  const copyToClipboard = () => {
    track("space_success_link_copied");
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    navigate("/inbox");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 text-white font-sans">
      <div className="w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden font-sans">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] bg-[#161616]">
          
          <span className="text-white text-xs font-bold tracking-wider">
            SUCCESS
          </span>
         
        </div>

        <div className="p-8 pb-6 flex flex-col items-center text-center relative">
          
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#6B6B6B] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-white text-xl font-bold mb-2">
            Added {spaceName} successfully!
          </h2>
          <div className="text-2xl mb-4">🎉</div>
          
          <p className="text-[#6B6B6B] text-sm mb-6">
            Here is the link for your customers:
          </p>

          <div className="w-full border border-[#2A2A2A] bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between mb-8 overflow-hidden gap-3">
            <LinkIcon className="w-4 h-4 text-[#6B6B6B] flex-shrink-0" />
            <span className="text-white text-sm truncate flex-1 font-medium text-left">
              {publicUrl}
            </span>
            <button 
              onClick={copyToClipboard}
              className={`${copied ? "text-[#5D5FEF]" : "text-[#6B6B6B] hover:text-white"} text-[10px] font-bold tracking-widest flex items-center gap-1.5 transition-colors uppercase`}
            >
              {copied ? (
                <>Copied! <Check className="w-3.5 h-3.5" /></>
              ) : (
                <>Copy <Copy className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <Button 
            onClick={handleClose}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold rounded-lg py-5 text-sm"
          >
            Close
          </Button>
          
        </div>
      </div>
    </div>
  );
}

