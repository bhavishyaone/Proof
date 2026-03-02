import React, { useState } from "react";
import { ArrowLeft, Inbox, Heart, Settings, Share2, GripVertical, Layers, Columns, LayoutGrid, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";



export default function WallOfLove({ testimonials = [] }) {
  const [activeLayout, setActiveLayout] = useState("animated");
  
  const approvedTestimonials = testimonials.filter(t => t.status === "approved");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0 hidden md:flex">
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
             <Link to="/inbox" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Inbox className="w-[18px] h-[18px]" /> Inbox
             </Link>
             <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-semibold transition-colors">
               <Heart className="w-[18px] h-[18px]" /> Wall of Love
             </Link>
          </nav>

          <nav className="space-y-1 mt-8">
             <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Settings className="w-[18px] h-[18px]" /> Space Settings
             </button>
             <Link to="/share" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Share2 className="w-[18px] h-[18px]" /> Share Link
             </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-8 flex items-center justify-between mt-10 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Wall of Love</h1>
              <p className="text-gray-400 text-sm">Approved testimonials appear here. Select layout and create your Wall.</p>
            </div>

        </header>

        <section className="px-8 mt-10">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Approved Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedTestimonials.length > 0 ? approvedTestimonials.map((t) => (
                <div key={t.id} className="bg-[#121212] border border-[#222] rounded-xl p-6 relative group flex flex-col">
                    <button className="absolute top-5 right-4 text-gray-600 hover:text-gray-300 transition-colors">
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        {t.avatar ? (
                            <img src={t.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0" alt={t.name} />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${t.avatarColor || "bg-[#333] text-white"}`}>
                                {t.avatarInitial || t.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-bold text-white leading-none">{t.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[9px] font-extrabold text-[#10B981] tracking-wider uppercase">Approved</span>
                                <div className="flex items-center">
                                    {[...Array(t.rating || 5)].map((_, i) => (
                                        <svg key={i} className="w-3.5 h-3.5 text-[#F59E0B] fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {t.type === "video" ? (
                      <div className="w-full h-32 bg-[#1A1A1A] rounded-lg overflow-hidden relative mt-2">
                        <img src={t.videoThumbnail} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                            </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-[15px] leading-relaxed">
                        {t.content}
                      </p>
                    )}
                </div>
            )) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#1F1F1F] rounded-xl">
                 <Heart className="w-8 h-8 text-gray-600 mb-3" />
                 <p className="text-gray-400 font-medium">No approved testimonials yet.</p>
                 <p className="text-xs text-gray-500 mt-1">Head back to your Inbox to approve some!</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-8 mt-12 mb-10 border-t border-[#1F1F1F] pt-10">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Wall Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div 
                    onClick={() => setActiveLayout("fixed")}
                    className={`bg-[#151515] rounded-xl flex flex-col items-center cursor-pointer transition-all relative h-64 border-[1.5px] overflow-hidden group ${activeLayout === "fixed" ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "border-[#1F1F1F] hover:border-[#333]"}`}
                >
                    {activeLayout === "fixed" && (
                        <div className="absolute top-3 right-3 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <LayoutGrid className={`w-8 h-8 mb-4 stroke-[1.5px] ${activeLayout === "fixed" ? "text-white" : "text-gray-500"}`} />
                    <span className={`text-[15px] font-semibold mb-6 ${activeLayout === "fixed" ? "text-white" : "text-gray-500"}`}>Masonry Fixed</span>
                    <div className={`w-4 h-4 rounded-full border ${activeLayout === "fixed" ? "bg-white border-white" : "border-[#444] bg-transparent"}`} />
                </div>

                <div 
                    onClick={() => setActiveLayout("animated")}
                    className={`bg-[#151515] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all relative h-48 border-[1.5px] ${activeLayout === "animated" ? "border-white" : "border-transparent hover:border-[#333]"}`}
                >
                    {activeLayout === "animated" && (
                        <div className="absolute top-3 right-3 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <Layers className={`w-8 h-8 mb-4 stroke-[1.5px] ${activeLayout === "animated" ? "text-white" : "text-gray-500"}`} />
                    <span className={`text-[15px] font-semibold mb-6 ${activeLayout === "animated" ? "text-white" : "text-gray-500"}`}>Masonry Animated</span>
                    <div className={`w-4 h-4 rounded-full border ${activeLayout === "animated" ? "bg-white border-white" : "border-[#444] bg-transparent"}`} />
                </div>

                <div 
                    onClick={() => setActiveLayout("carousel")}
                    className={`bg-[#151515] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all relative h-48 border-[1.5px] ${activeLayout === "carousel" ? "border-white" : "border-transparent hover:border-[#333]"}`}
                >
                    {activeLayout === "carousel" && (
                        <div className="absolute top-3 right-3 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <Columns className={`w-8 h-8 mb-4 stroke-[1.5px] ${activeLayout === "carousel" ? "text-white" : "text-gray-500"}`} />
                    <span className={`text-[15px] font-semibold mb-6 ${activeLayout === "carousel" ? "text-white" : "text-gray-500"}`}>Carousel</span>
                    <div className={`w-4 h-4 rounded-full border ${activeLayout === "carousel" ? "bg-white border-white" : "border-[#444] bg-transparent"}`} />
                </div>
            </div>

            <div className="flex justify-center mb-24 mt-6">
                <Button className="bg-white text-black hover:bg-gray-200 font-extrabold px-12 py-7 text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Create Wall
                </Button>
            </div>

        </section>

      </main>
    </div>
  );
}
