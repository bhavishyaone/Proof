import React, { useState } from "react";
import { Search, Inbox, Heart, Settings, Share2, ArrowLeft, Heart as HeartOutline, Trash2, CheckCircle, XCircle, Video as VideoIcon, Archive, AlertOctagon ,Undo2} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FilterButton = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active 
        ? "bg-white text-black" 
        : "bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
    }`}
  >
    {label}
  </button>
);

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1 justify-center my-4">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-[#EAB308]" : "text-gray-600"}`}>
        ★
      </span>
    ))}
  </div>
);

export default function SpaceInbox({ testimonials, setTestimonials }) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTestimonials = testimonials.filter(t => {

    let matchesCategory = false;
    if (filter === "All") matchesCategory = true;
    else if (filter === "Video") matchesCategory = t.type === "video";
    else if (filter === "Text") matchesCategory = t.type === "text";
    else if (filter === "Liked") matchesCategory = t.liked === true;
    else if (filter === "Archived") matchesCategory = t.status === "archived";
    else if (filter === "Spam") matchesCategory = t.status === "spam";
    

    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleApprove = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  };

  const handleUnapprove = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "pending" } : t));
  };

  const handleReject = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" } : t));
  };

  const toggleLike = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked } : t));
  };

  const handleArchive = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "archived" } : t));
  };

  const handleSpam = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "spam" } : t));
  };

  const handleDelete = (id) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      

      <aside className="w-64 border-r border-[#1F1F1F] flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight mb-8">Proof</h1>
          
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>

          <div className="flex items-center gap-3 mb-8 px-2 py-1.5 bg-[#1A1A1A] rounded-lg">
            <div className="w-6 h-6 rounded bg-[#2A2A2A] flex items-center justify-center text-xs font-bold font-serif">
              B
            </div>
            <span className="text-sm font-semibold truncate">Bhavishya's Pro...</span>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium">
              <Inbox className="w-4 h-4" /> Inbox
            </button>
            <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg text-sm font-medium transition-colors">
              <Heart className="w-4 h-4" /> Wall of Love
            </Link>
          </nav>

          <nav className="space-y-1 mt-8">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg text-sm font-medium transition-colors">
              <Settings className="w-4 h-4" /> Space Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg text-sm font-medium transition-colors">
              <Share2 className="w-4 h-4" /> Share Link
            </button>
          </nav>
        </div>
      </aside>


      <main className="flex-1 flex flex-col h-screen overflow-hidden">


        <header className="px-8 py-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">Inbox</h1>
            <span className="bg-[#1A1A1A] text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">{filteredTestimonials.length}</span>
          </div>


          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Video", "Text", "Liked", "Archived", "Spam"].map((lbl) => (
              <FilterButton 
                key={lbl} 
                label={lbl} 
                active={filter === lbl} 
                onClick={() => setFilter(lbl)} 
              />
            ))}
          </div>
        </header>


        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="relative mb-8 max-w-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search testimonials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border-[#1F1F1F] text-white pl-10 h-11 rounded-lg focus-visible:ring-1 focus-visible:ring-[#5D5FEF] placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTestimonials.map((t) => (
              <div key={t.id} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 flex flex-col">
                

                <div className="flex flex-col items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 ${t.avatarColor}`}>
                    {t.avatarInitial}
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{t.name}</h3>
                    {t.status === "approved" && (
                      <span className="bg-[#064E3B] text-[#34D399] text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider">APPROVED</span>
                    )}
                    {t.type === "video" && (
                      <span className="bg-[#1A1A1A] text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider flex items-center gap-1">
                        <VideoIcon className="w-2.5 h-2.5" /> VIDEO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{t.email}  {t.timeAgo}</p>
                </div>

                <StarRating rating={t.rating} />


                <div className="flex-1 mb-6">
                  {t.type === "text" ? (
                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                      "{t.content}"
                    </p>
                  ) : (
                    <div className="w-full h-40 bg-[#1A1A1A] rounded-lg overflow-hidden relative group cursor-pointer">
                      <img src={t.videoThumbnail} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleLike(t.id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors">
                      {t.liked ? (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      ) : (
                        <HeartOutline className="w-4 h-4 text-gray-500 hover:text-white" />
                      )}
                    </button>
                    <button onClick={() => handleArchive(t.id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors">
                      <Archive className="w-4 h-4 text-gray-500 hover:text-white" />
                    </button>
                    <button onClick={() => handleSpam(t.id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors group">
                      <AlertOctagon className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors group">
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                    </button>
                  </div>
                  
                  {t.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(t.id)} className="w-8 h-8 rounded bg-[#064E3B] hover:bg-[#065F46] flex items-center justify-center transition-colors">
                        <CheckCircle className="w-4 h-4 text-[#34D399]" />
                      </button>
                      <button onClick={() => handleReject(t.id)} className="w-8 h-8 rounded bg-[#450A0A] hover:bg-[#7F1D1D] flex items-center justify-center transition-colors">
                        <XCircle className="w-4 h-4 text-[#F87171]" />
                      </button>
                    </div>
                  ) : t.status === "approved" ? (
                    <button onClick={() => handleUnapprove(t.id)} title="Unapprove (remove from Wall of Love)" className="w-8 h-8 rounded bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors group">
                       <Undo2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                  ) : (
                    <div className="w-8 h-8 text-transparent flex items-center justify-center select-none cursor-default">
                      
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
