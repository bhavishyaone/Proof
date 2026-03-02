import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Inbox, Heart, Edit, Share2, Copy, Check, Link as LinkIcon } from "lucide-react";

export default function ShareLink() {
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const spaceSlug = "bhavishya-s-product"; 
  const publicUrl = `https://useproof.io/${spaceSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">Proof</h1>
          
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8 px-3 py-2.5 bg-[#1F1F1F] rounded-xl border border-[#2A2A2A]">
            <div className="w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center text-sm font-bold font-serif text-white">
              B
            </div>
            <span className="text-[15px] font-bold text-white tracking-wide truncate">Bhavishya's Pro...</span>
          </div>

          <nav className="space-y-1">
             <Link to="/inbox" className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Inbox className="w-[18px] h-[18px]" /> Inbox
             </Link>
             <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Heart className="w-[18px] h-[18px]" /> Wall of Love
             </Link>
          </nav>

          <nav className="space-y-1 mt-8">
             <Link to="/edit-space" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Edit className="w-[18px] h-[18px]" /> Edit Space
             </Link>
             <Link to="/share" className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-semibold transition-colors">
               <Share2 className="w-[18px] h-[18px]" /> Share Link
             </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0A] border-l border-[#1F1F1F]">
        
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#1F1F1F] bg-[#0A0A0A]">
          <h2 className="text-xl font-bold">Share Link</h2>
        </header>

        <div className="flex-1 overflow-auto p-12 flex justify-center mt-12">
          
          <div className="w-full max-w-2xl">
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center justify-center text-center">
                
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6 border border-[#2A2A2A]">
                  <LinkIcon className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-2xl font-bold mb-3">Share your link</h1>
                <p className="text-[#6B6B6B] text-sm max-w-sm mb-10 leading-relaxed">
                  Send this link to your customers via email, social media, or anywhere else to start collecting testimonials.
                </p>

                <div className="w-full relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-[#6B6B6B]" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="w-full bg-[#1A1A1A] border-2 border-[#2A2A2A] text-white rounded-xl py-4 pl-12 pr-32 font-medium focus:outline-none focus:border-white transition-colors cursor-text"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`absolute inset-y-2 right-2 px-6 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${
                      copied 
                        ? "bg-[#22C55E] text-white" 
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        Copied!
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Copy
                        <Copy className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
