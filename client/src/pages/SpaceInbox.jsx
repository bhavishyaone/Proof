import React, { useState, useContext, useEffect } from "react";
import { Search, Inbox, Heart, Edit, Share2, ArrowLeft, Heart as HeartOutline, Trash2, CheckCircle, XCircle, Video as VideoIcon, Archive, AlertOctagon, Undo2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SpaceContext } from "../context/SpaceContext";
import api from "../lib/api";

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

export default function SpaceInbox() {
  const { activeSpace } = useContext(SpaceContext);
  const spaceName = activeSpace?.name || "My Space";
  const spaceInitial = spaceName.charAt(0).toUpperCase();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/workspace/${activeSpace._id}/testimonials`);
        setTestimonials(res.data.testimonials || []);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [activeSpace?._id]);

  const updateLocal = (id, changes) => {
    setTestimonials(prev => prev.map(t => t._id === id ? { ...t, ...changes } : t));
  };

  const handleApprove = async (id) => {
    await api.patch(`/testimonials/${id}/approve`);
    updateLocal(id, { status: "approved" });
  };

  const handleUnapprove = async (id) => {
    await api.patch(`/testimonials/${id}/reject`);
    updateLocal(id, { status: "pending" });
  };

  const handleReject = async (id) => {
    await api.patch(`/testimonials/${id}/reject`);
    updateLocal(id, { status: "rejected" });
  };

  const toggleLike = async (id) => {
    const t = testimonials.find(t => t._id === id);
    await api.patch(`/testimonials/${id}/like`);
    updateLocal(id, { liked: !t.liked });
  };

  const handleArchive = async (id) => {
    await api.patch(`/testimonials/${id}/archive`);
    updateLocal(id, { archived: true });
  };

  const handleSpam = async (id) => {
    await api.patch(`/testimonials/${id}/spam`);
    updateLocal(id, { spam: true });
  };

  const handleDelete = async (id) => {
    await api.delete(`/testimonials/${id}`);
    setTestimonials(prev => prev.filter(t => t._id !== id));
  };


  const filteredTestimonials = testimonials.filter(t => {
    let matchesCategory = false;
    if (filter === "All") matchesCategory = !t.archived && !t.spam;
    else if (filter === "Video") matchesCategory = t.type === "video" && !t.archived && !t.spam;
    else if (filter === "Text") matchesCategory = t.type === "text" && !t.archived && !t.spam;
    else if (filter === "Liked") matchesCategory = t.liked === true;
    else if (filter === "Archived") matchesCategory = t.archived === true;
    else if (filter === "Spam") matchesCategory = t.spam === true;
    const matchesSearch = (t.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      


      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0 hidden md:flex">
        <div className="p-6">

          <Link to="/" className="block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-extrabold tracking-tight mb-8">Proof</h1>
          </Link>
          

          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>


          <div className="flex items-center gap-3 mb-8 px-3 py-2.5 bg-[#1F1F1F] rounded-xl border border-[#2A2A2A]">
            <div className="w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center text-sm font-bold font-serif text-white overflow-hidden">
              {activeSpace?.logo ? (
                <img src={activeSpace.logo} alt="logo" className="w-full h-full object-cover" />
              ) : (
                spaceInitial
              )}
            </div>
            <span className="text-[15px] font-bold text-white tracking-wide truncate">{spaceName}</span>
          </div>

          <nav className="space-y-1">
             <Link to="/inbox" className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-semibold transition-colors">
               <Inbox className="w-[18px] h-[18px]" /> Inbox
             </Link>
             <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Heart className="w-[18px] h-[18px]" /> Wall of Love
             </Link>
          </nav>

          <nav className="space-y-1 mt-8">
             <Link to="/edit-space" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Edit className="w-[18px] h-[18px]" /> Edit Space
             </Link>
             <Link to="/share" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Share2 className="w-[18px] h-[18px]" /> Share Link
             </Link>
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

          {loading ? (
            <div className="flex items-center justify-center mt-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B6B6B]" />
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 text-center">
              <p className="text-gray-500 text-sm">No testimonials found.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTestimonials.map((t) => (
              <div key={t._id} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 flex flex-col">
                

                <div className="flex flex-col items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-lg font-bold mb-3 text-white">
                    {(t.name || "?").charAt(0).toUpperCase()}
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
                  <p className="text-xs text-gray-500">{t.email}</p>
                </div>

                <StarRating rating={t.rating} />


                <div className="flex-1 mb-6">
                  {t.type === "text" ? (
                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                      &quot;{t.content}&quot;
                    </p>
                  ) : (
                    <div className="w-full h-40 bg-[#1A1A1A] rounded-lg overflow-hidden relative">
                      {t.videoUrl ? (
                        <video
                          src={t.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <VideoIcon className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                  )}
                </div>


                <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleLike(t._id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors">
                      {t.liked ? (
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      ) : (
                        <HeartOutline className="w-4 h-4 text-gray-500 hover:text-white" />
                      )}
                    </button>
                    <button onClick={() => handleArchive(t._id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors">
                      <Archive className="w-4 h-4 text-gray-500 hover:text-white" />
                    </button>
                    <button onClick={() => handleSpam(t._id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors group">
                      <AlertOctagon className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors group">
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                    </button>
                  </div>

                  {t.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(t._id)} className="w-8 h-8 rounded bg-[#064E3B] hover:bg-[#065F46] flex items-center justify-center transition-colors">
                        <CheckCircle className="w-4 h-4 text-[#34D399]" />
                      </button>
                      <button onClick={() => handleReject(t._id)} className="w-8 h-8 rounded bg-[#450A0A] hover:bg-[#7F1D1D] flex items-center justify-center transition-colors">
                        <XCircle className="w-4 h-4 text-[#F87171]" />
                      </button>
                    </div>
                  ) : t.status === "approved" ? (
                    <button onClick={() => handleUnapprove(t._id)} title="Unapprove" className="w-8 h-8 rounded bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors group">
                      <Undo2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                  ) : (
                    <div className="w-8 h-8 text-transparent flex items-center justify-center select-none cursor-default" />
                  )}
                </div>
              </div>
            ))}
          </div>
          )}

        </div>
      </main>
    </div>
  );
}
