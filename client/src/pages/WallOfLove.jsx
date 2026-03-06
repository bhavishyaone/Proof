import React, { useState, useContext, useEffect } from "react";
import { ArrowLeft, Inbox, Heart, Edit, Share2, GripVertical, Layers, Columns, LayoutGrid, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { SpaceContext } from "../context/SpaceContext";
import api from "../lib/api";



export default function WallOfLove() {
  const { activeSpace } = useContext(SpaceContext);
  const spaceName = activeSpace?.name || "My Space";
  const spaceInitial = spaceName.charAt(0).toUpperCase();
  const navigate = useNavigate();

  const [activeLayout, setActiveLayout] = useState("animated");
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLayout, setSavingLayout] = useState(false);


  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchApproved = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/workspace/${activeSpace._id}/testimonials?status=approved`);
        setTestimonials(res.data.testimonials || []);
      } catch (err) {
        console.error("Failed to fetch approved testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, [activeSpace?._id]);


  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchWall = async () => {
      try {
        const res = await api.get(`/workspace/${activeSpace._id}/wall`);
        if (res.data.wall?.layout) setActiveLayout(res.data.wall.layout);
      } catch (_) {}
    };
    fetchWall();
  }, [activeSpace?._id]);


  const handleLayoutSelect = async (layout) => {
    setActiveLayout(layout);
    setSavingLayout(true);
    try {
      await api.patch(`/workspace/${activeSpace._id}/wall`, { layout });
    } catch (_) {}
    finally {
      setSavingLayout(false);
    }
  };

  const approvedTestimonials = testimonials;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0 hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">Proof</h1>
          
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
             <Link to="/inbox" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-xl text-[15px] font-semibold transition-colors">
               <Inbox className="w-[18px] h-[18px]" /> Inbox
             </Link>
             <Link to="/wall-of-love" className="w-full flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-[15px] font-semibold transition-colors">
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

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-8 flex items-center justify-between mt-10 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Wall of Love</h1>
              <p className="text-gray-400 text-sm">Approved testimonials appear here. Select layout and create your Wall.</p>
            </div>

        </header>

        <section className="px-8 mt-10">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Approved Testimonials</h2>
          
          {loading ? (
            <div className="flex items-center justify-center mt-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B6B6B]" />
            </div>
          ) : approvedTestimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 text-center">
              <p className="text-gray-500 text-sm">No approved testimonials yet. Approve some from the Inbox!</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedTestimonials.map((t) => (
                <div key={t._id} className="bg-[#121212] border border-[#222] rounded-xl p-6 relative group flex flex-col">
                    <button className="absolute top-5 right-4 text-gray-600 hover:text-gray-300 transition-colors">
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-sm font-bold flex-shrink-0 text-white">
                            {(t.name || "?").charAt(0).toUpperCase()}
                        </div>
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
                        {t.videoUrl ? (
                          <video src={t.videoUrl} className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">Video</span>
                          </div>
                        )}
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
            ))}
          </div>
          )}
        </section>

        <section className="px-8 mt-12 mb-10 border-t border-[#1F1F1F] pt-10">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Wall Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                <div
                    onClick={() => handleLayoutSelect("fixed")}
                    className={`bg-[#111] rounded-xl cursor-pointer transition-all relative border-[1.5px] overflow-hidden group ${activeLayout === "fixed" ? "border-white shadow-[0_0_24px_rgba(255,255,255,0.07)]" : "border-[#222] hover:border-[#444]"}`}
                    style={{ height: 220 }}
                >
                    {activeLayout === "fixed" && (
                        <div className="absolute top-3 right-3 z-10 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <div className="absolute inset-0 overflow-hidden p-3 columns-2 gap-2 pointer-events-none">
                        {[
                          { h: "h-16", text: "Absolutely love this product!", stars: 5, avatar: "https://i.pravatar.cc/32?u=a" },
                          { h: "h-24", text: "Game changer for our workflow. Highly recommend to everyone!", stars: 5, avatar: "https://i.pravatar.cc/32?u=b" },
                          { h: "h-20", text: "Top-notch support and clean UI.", stars: 4, avatar: "https://i.pravatar.cc/32?u=c" },
                          { h: "h-14", text: "Fantastic results.", stars: 5, avatar: "https://i.pravatar.cc/32?u=d" },
                        ].map((card, i) => (
                          <div key={i} className={`${card.h} bg-[#1E1E1E] rounded-lg p-2 flex flex-col gap-1 border border-[#2A2A2A] break-inside-avoid mb-2`}>
                            <div className="flex items-center gap-1.5">
                              <img src={card.avatar} className="w-4 h-4 rounded-full object-cover" alt="" />
                              <div className="flex gap-px">{Array(card.stars).fill(0).map((_, s) => <span key={s} className="text-yellow-400 text-[7px]">★</span>)}</div>
                            </div>
                            <p className="text-[7px] text-gray-400 leading-tight line-clamp-3">{card.text}</p>
                          </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent py-3 flex flex-col items-center gap-1.5">
                        <span className={`text-[13px] font-semibold ${activeLayout === "fixed" ? "text-white" : "text-gray-400"}`}>Masonry Fixed</span>
                        <div className={`w-3.5 h-3.5 rounded-full border ${activeLayout === "fixed" ? "bg-white border-white" : "border-[#555] bg-transparent"}`} />
                    </div>
                </div>

                <div
                    onClick={() => handleLayoutSelect("animated")}
                    className={`bg-[#111] rounded-xl cursor-pointer transition-all relative border-[1.5px] overflow-hidden group ${activeLayout === "animated" ? "border-white shadow-[0_0_24px_rgba(255,255,255,0.07)]" : "border-[#222] hover:border-[#444]"}`}
                    style={{ height: 220 }}
                >
                    {activeLayout === "animated" && (
                        <div className="absolute top-3 right-3 z-10 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <div className="absolute inset-0 overflow-hidden p-3 flex gap-2 pointer-events-none">
                      {[
                        [
                          { text:"Life-changing product!", avatar:"https://i.pravatar.cc/32?u=e", stars:5 },
                          { text:"Really polished UI.", avatar:"https://i.pravatar.cc/32?u=f", stars:4 },
                          { text:"Great onboarding.", avatar:"https://i.pravatar.cc/32?u=g", stars:5 },
                          { text:"Love the simplicity!", avatar:"https://i.pravatar.cc/32?u=h", stars:5 },
                        ],
                        [
                          { text:"Best tool we found.", avatar:"https://i.pravatar.cc/32?u=i", stars:5 },
                          { text:"10x our conversions.", avatar:"https://i.pravatar.cc/32?u=j", stars:5 },
                          { text:"The support is amazing!", avatar:"https://i.pravatar.cc/32?u=k", stars:4 },
                          { text:"Seamless experience.", avatar:"https://i.pravatar.cc/32?u=l", stars:5 },
                        ],
                        [
                          { text:"Highly recommended.", avatar:"https://i.pravatar.cc/32?u=m", stars:5 },
                          { text:"Saved us hours daily.", avatar:"https://i.pravatar.cc/32?u=n", stars:5 },
                          { text:"Must-have for any team!", avatar:"https://i.pravatar.cc/32?u=o", stars:4 },
                          { text:"Zero friction setup.", avatar:"https://i.pravatar.cc/32?u=p", stars:5 },
                        ],
                      ].map((col, ci) => (
                        <div key={ci} className="flex-1 overflow-hidden">
                          <div
                            className="flex flex-col gap-2"
                            style={{
                              animation: `${ci % 2 === 0 ? "previewScrollUp" : "previewScrollDown"} ${5 + ci}s linear infinite`,
                            }}
                          >
                            {[...col, ...col].map((card, i) => (
                              <div key={i} className="bg-[#1E1E1E] rounded-lg p-2 flex flex-col gap-1 border border-[#2A2A2A]">
                                <div className="flex items-center gap-1.5">
                                  <img src={card.avatar} className="w-4 h-4 rounded-full object-cover" alt="" />
                                  <div className="flex gap-px">{Array(card.stars).fill(0).map((_, s) => <span key={s} className="text-yellow-400 text-[7px]">★</span>)}</div>
                                </div>
                                <p className="text-[7px] text-gray-400 leading-tight">{card.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent py-3 flex flex-col items-center gap-1.5">
                        <span className={`text-[13px] font-semibold ${activeLayout === "animated" ? "text-white" : "text-gray-400"}`}>Masonry Animated</span>
                        <div className={`w-3.5 h-3.5 rounded-full border ${activeLayout === "animated" ? "bg-white border-white" : "border-[#555] bg-transparent"}`} />
                    </div>
                </div>

                <div
                    onClick={() => handleLayoutSelect("carousel")}
                    className={`bg-[#111] rounded-xl cursor-pointer transition-all relative border-[1.5px] overflow-hidden group ${activeLayout === "carousel" ? "border-white shadow-[0_0_24px_rgba(255,255,255,0.07)]" : "border-[#222] hover:border-[#444]"}`}
                    style={{ height: 220 }}
                >
                    {activeLayout === "carousel" && (
                        <div className="absolute top-3 right-3 z-10 bg-white text-black rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" fill="white" />
                        </div>
                    )}
                    <div className="absolute inset-0 overflow-hidden flex items-center justify-start pointer-events-none mt-2">
                        <div 
                           className="flex gap-3 whitespace-nowrap"
                           style={{ animation: "previewScrollLeft 10s linear infinite" }}
                        >
                            {[
                                { name: "Sarah J.", avatar: "https://i.pravatar.cc/32?u=q", text: "Absolutely game-changing product!" },
                                { name: "Mark T.", avatar: "https://i.pravatar.cc/32?u=w", text: "Game changer for our workflow. Highly recommend to everyone!" },
                                { name: "Elena R.", avatar: "https://i.pravatar.cc/32?u=e", text: "Top-notch support and clean UI." },
                                { name: "David L.", avatar: "https://i.pravatar.cc/32?u=r", text: "Fantastic results and super fast." },
                                { name: "Sarah J.", avatar: "https://i.pravatar.cc/32?u=q", text: "Absolutely game-changing product!" },
                                { name: "Mark T.", avatar: "https://i.pravatar.cc/32?u=w", text: "Game changer for our workflow. Highly recommend to everyone!" },
                                { name: "Elena R.", avatar: "https://i.pravatar.cc/32?u=e", text: "Top-notch support and clean UI." },
                                { name: "David L.", avatar: "https://i.pravatar.cc/32?u=r", text: "Fantastic results and super fast." },
                            ].map((user, i) => (
                                <div key={i} className="bg-[#1E1E1E] rounded-xl p-3 border border-[#2A2A2A] w-[200px] flex-shrink-0 flex flex-col gap-2 whitespace-normal">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                                        <div>
                                            <p className="text-[9px] font-semibold text-white">{user.name}</p>
                                            <div className="flex gap-px">{Array(5).fill(0).map((_, s) => <span key={s} className="text-yellow-400 text-[7px]">★</span>)}</div>
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-gray-400 leading-tight">{user.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-9 inset-x-0 flex justify-center gap-1">
                        {[0,1,2].map(d => <div key={d} className={`rounded-full ${d===0 ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-[#444]"}`} />)}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent py-3 flex flex-col items-center gap-1.5">
                        <span className={`text-[13px] font-semibold ${activeLayout === "carousel" ? "text-white" : "text-gray-400"}`}>Carousel</span>
                        <div className={`w-3.5 h-3.5 rounded-full border ${activeLayout === "carousel" ? "bg-white border-white" : "border-[#555] bg-transparent"}`} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-24 mt-6">
                <Button
                  onClick={() => navigate("/wall-configuration", { state: { layout: activeLayout } })}
                  disabled={savingLayout}
                  className="bg-white text-black hover:bg-gray-200 font-extrabold px-12 py-7 text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {savingLayout ? "Saving..." : "Create Wall"}
                </Button>
            </div>

        </section>

      </main>
    </div>
  );
}
