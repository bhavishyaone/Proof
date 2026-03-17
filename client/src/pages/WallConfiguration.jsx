import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox, Heart, Edit, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SpaceContext } from "../context/SpaceContext";
import { track } from "../analytics.jsx";
import api from "../lib/api";

export default function WallConfiguration() {
  const { activeSpace } = useContext(SpaceContext);
  const spaceName = activeSpace?.name || "My Space";
  const spaceInitial = spaceName.charAt(0).toUpperCase();

  const [darkTheme, setDarkTheme] = useState(true);
  const [cardSize, setCardSize] = useState("Medium");
  const [arrowColor, setArrowColor] = useState("white");
  const [hideDate, setHideDate] = useState(false);
  const [hideSourceIcons, setHideSourceIcons] = useState(false);
  const [minimizeImages, setMinimizeImages] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [oneRowSlider, setOneRowSlider] = useState(false);
  const [sameHeightVideos, setSameHeightVideos] = useState(true);
  const [saving, setSaving] = useState(false);


  const [previewTestimonials, setPreviewTestimonials] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselDir, setCarouselDir] = useState("next");

  useEffect(() => {
    track("wall_configuration_view");
  }, []);

  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchPreview = async () => {
      setLoadingPreview(true);
      try {
        const res = await api.get(`/workspace/${activeSpace._id}/testimonials?status=approved`);
        setPreviewTestimonials(res.data.testimonials || []);
      } catch (_) {}
      finally { setLoadingPreview(false); }
    };
    fetchPreview();
  }, [activeSpace?._id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 604800)}w`;
  };

  const location = useLocation();
  const navigate = useNavigate();
  const layout = location.state?.layout || "animated";


  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchWall = async () => {
      try {
        const res = await api.get(`/workspace/${activeSpace._id}/wall`);
        const w = res.data.wall;
        if (!w) return;
        if (w.darkTheme !== undefined) setDarkTheme(w.darkTheme);
        if (w.cardSize) setCardSize(w.cardSize.charAt(0).toUpperCase() + w.cardSize.slice(1));
        if (w.arrowColor) setArrowColor(w.arrowColor);
        if (w.hideDate !== undefined) setHideDate(w.hideDate);
        if (w.hideSourceIcons !== undefined) setHideSourceIcons(w.hideSourceIcons);
        if (w.minimizeImages !== undefined) setMinimizeImages(w.minimizeImages);
        if (w.autoplay !== undefined) setAutoplay(w.autoplay);
        if (w.oneRowSlider !== undefined) setOneRowSlider(w.oneRowSlider);
        if (w.sameHeightVideos !== undefined) setSameHeightVideos(w.sameHeightVideos);
      } catch (_) {}
    };
    fetchWall();
  }, [activeSpace?._id]);


  const handleSaveAndContinue = async () => {
    track("wall_configuration_saved");
    setSaving(true);
    try {
      await api.patch(`/workspace/${activeSpace._id}/wall`, {
        darkTheme,
        cardSize: cardSize.toLowerCase(),
        arrowColor,
        hideDate,
        hideSourceIcons,
        minimizeImages,
        autoplay,
        oneRowSlider,
        sameHeightVideos,
      });
    } catch (_) {}
    finally {
      setSaving(false);
      navigate("/embed-code", { state: { layout } });
    }
  };


  const renderCard = (t, animStyle = {}) => (
    <div key={t._id} style={animStyle} className={`transition-all duration-300 border rounded-2xl shadow-xl ${darkTheme ? 'bg-[#151515] border-[#222]' : 'bg-white border-gray-200'} ${cardSize === 'Small' ? 'p-4' : cardSize === 'Large' ? 'p-8' : 'p-6'}`}>
      <div className="flex gap-1 mb-4">
        {Array(t.rating || 5).fill(0).map((_, i) => <span key={i} className={`text-sm ${darkTheme ? 'text-[#F59E0B]' : 'text-yellow-400'}`}>★</span>)}
        {Array(5 - (t.rating || 5)).fill(0).map((_, i) => <span key={i} className="text-gray-400 text-sm">★</span>)}
      </div>
      {t.type === 'video' && t.videoUrl ? (
        <video src={t.videoUrl} controls className="w-full rounded-xl mb-6 max-h-36 object-cover" />
      ) : (
        <p className={`leading-relaxed mb-6 line-clamp-3 ${darkTheme ? 'text-gray-200' : 'text-gray-800'} ${cardSize === 'Small' ? 'text-xs' : cardSize === 'Large' ? 'text-base' : 'text-sm'}`}>&quot;{t.message}&quot;</p>
      )}
      <div className="flex items-center gap-3">
        {!minimizeImages && (
          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${darkTheme ? 'bg-[#2A2A2A] text-white' : 'bg-gray-200 text-gray-700'}`}>
            {t.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <p className={`font-bold truncate ${darkTheme ? 'text-white' : 'text-black'} ${cardSize === 'Small' ? 'text-xs' : cardSize === 'Large' ? 'text-base' : 'text-sm'}`}>{t.name}</p>
            {!hideSourceIcons && <div className={`w-3 h-3 rounded-sm ml-2 flex-shrink-0 ${darkTheme ? 'bg-[#333]' : 'bg-gray-300'}`} />}
          </div>
          <div className="flex text-[11px] gap-2 items-center mt-0.5">
            <p className={`truncate ${darkTheme ? 'text-gray-500' : 'text-gray-500'}`}>{t.email}</p>
            {!hideDate && <span className={darkTheme ? 'text-gray-600' : 'text-gray-400'}>• {formatDate(t.createdAt)}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const switchClass = "data-[state=checked]:bg-white data-[state=unchecked]:bg-[#2a2a2a] [&>span]:data-[state=checked]:bg-black [&>span]:data-[state=unchecked]:bg-gray-400 border-none shadow-none ring-0";

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0 hidden md:flex border-r border-[#1F1F1F]">
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
              ) : spaceInitial}
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

      <main className="flex-1 flex flex-col h-full bg-[#0A0A0A] overflow-hidden">
        
        <header className="flex items-center justify-center px-8 py-4 border-b border-[#1F1F1F] relative shrink-0">
          <h2 className="text-[12px] font-bold text-white uppercase tracking-widest">Wall Configuration</h2>
        </header>

        <div className="flex-1 flex overflow-hidden">
            
            <div className="flex-1 p-8 flex flex-col bg-[#0A0A0A] overflow-y-auto w-full max-w-4xl mx-auto border-r border-[#1F1F1F]">
                
                <div className="bg-[#1A1A1A] rounded-full px-4 py-2 text-[11px] font-bold tracking-wide uppercase text-white inline-flex items-center justify-center self-start mb-6">
                    Live Preview
                </div>

                <div className={`flex-1 border border-[#1F1F1F] rounded-3xl relative flex flex-col items-center justify-center p-8 min-h-[500px] transition-colors duration-300 ${darkTheme ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
                    
                    {loadingPreview ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                      </div>
                    ) : previewTestimonials.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <p className={`text-sm font-medium ${darkTheme ? 'text-gray-500' : 'text-gray-400'}`}>No approved testimonials yet</p>
                        <p className={`text-xs ${darkTheme ? 'text-gray-600' : 'text-gray-500'}`}>Approve testimonials in Inbox to see them here</p>
                      </div>
                    ) : layout === 'carousel' ? (

                      <div className="w-full max-w-md mx-auto" style={{ overflow: 'hidden' }}>
                        <style>{`
                          @keyframes slideFromRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
                          @keyframes slideFromLeft  { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
                        `}</style>
                        
                        <div
                          key={carouselIdx}
                          style={{ animation: carouselDir === 'next' ? 'slideFromRight 0.32s ease-out both' : 'slideFromLeft 0.32s ease-out both' }}
                        >
                          {previewTestimonials.length > 0 && renderCard(previewTestimonials[carouselIdx])}
                        </div>

                        {previewTestimonials.length > 1 && (
                          <div className="flex items-center justify-center gap-4 mt-5">
                            <button
                              onClick={() => { 
                                track("wall_configuration_preview_carousel_click", { arrow: "prev" });
                                setCarouselDir('prev'); 
                                setCarouselIdx(i => (i - 1 + previewTestimonials.length) % previewTestimonials.length); 
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer border-0 ${arrowColor === 'white' ? 'bg-white text-black' : arrowColor === 'yellow' ? 'bg-[#F59E0B] text-black' : 'border border-[#444] bg-transparent text-white'}`}
                            >
                              ‹
                            </button>
                            <div className="flex gap-2">
                              {previewTestimonials.map((_, i) => (
                                <div
                                  key={i}
                                  onClick={() => {
                      track("wall_configuration_preview_carousel_click", { dot: i });
                      setCarouselDir(i > carouselIdx ? 'next' : 'prev'); 
                      setCarouselIdx(i); 
                    }}
                                  className="cursor-pointer transition-all duration-300 rounded-full"
                                  style={{ width: i === carouselIdx ? '18px' : '8px', height: '8px', background: i === carouselIdx ? (darkTheme ? '#fff' : '#111') : (darkTheme ? '#333' : '#ccc') }}
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => { 
                                track("wall_configuration_preview_carousel_click", { arrow: "next" });
                                setCarouselDir('next'); 
                                setCarouselIdx(i => (i + 1) % previewTestimonials.length); 
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer border-0 ${arrowColor === 'white' ? 'bg-white text-black' : arrowColor === 'yellow' ? 'bg-[#F59E0B] text-black' : 'border border-[#444] bg-transparent text-white'}`}
                            >
                              ›
                            </button>
                          </div>
                        )}
                      </div>
                    ) : layout.includes('animated') ? (

                      <div className="w-full max-w-lg flex items-start justify-center gap-6 pointer-events-none">
                        <style>{`@keyframes previewFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }`}</style>
                        <div className="flex flex-col gap-6 flex-1">
                          {previewTestimonials.filter((_, i) => i % 2 === 0).map((t, i) => renderCard(t, { animation: 'previewFloat 3s ease-in-out infinite', animationDelay: `${i * 0.8}s` }))}
                        </div>
                        <div className="flex flex-col gap-6 flex-1">
                          {previewTestimonials.filter((_, i) => i % 2 === 1).map((t, i) => renderCard(t, { animation: 'previewFloat 3s ease-in-out infinite', animationDelay: `${(i * 0.8) + 0.4}s` }))}
                        </div>
                      </div>
                    ) : (

                      <div className="w-full max-w-lg flex items-start justify-center gap-6 pointer-events-none transition-all duration-300">
                        <div className="flex flex-col gap-6 flex-1">
                          {previewTestimonials.filter((_, i) => i % 2 === 0).map((t) => renderCard(t))}
                        </div>
                        <div className="flex flex-col gap-6 flex-1">
                          {previewTestimonials.filter((_, i) => i % 2 === 1).map((t) => renderCard(t))}
                        </div>
                      </div>
                    )}
                </div>

                <p className="text-center text-[11px] text-gray-500 mt-6 font-medium">
                    Preview updates as you change settings
                </p>
            </div>

            <div className="w-96 bg-[#0A0A0A] flex flex-col h-full border-l border-[#1F1F1F] shrink-0">
                <div className="flex-1 overflow-y-auto px-8 py-10">
                    
                    <div className="mb-10">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Appearance</h3>
                        
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[14px] font-medium text-gray-200">Dark theme</span>
                            <Switch checked={darkTheme} onCheckedChange={setDarkTheme} className={switchClass} />
                        </div>

                        <div className="mb-4">
                            <span className="block text-[14px] font-medium text-gray-200 mb-4">Card size</span>
                            <div className="flex bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-1 relative">
                                {["Small", "Medium", "Large"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setCardSize(size)}
                                        className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg transition-colors ${
                                            cardSize === size ? "bg-white text-black" : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Display</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-200">Hide Time</span>
                                <Switch checked={hideDate} onCheckedChange={setHideDate} className={switchClass} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-200">Hide source icons</span>
                                <Switch checked={hideSourceIcons} onCheckedChange={setHideSourceIcons} className={switchClass} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-200">Minimize images</span>
                                <Switch checked={minimizeImages} onCheckedChange={setMinimizeImages} className={switchClass} />
                            </div>
                        </div>
                    </div>

                    {layout === 'carousel' && (
                      <div className="mb-4">
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Carousel</h3>
                          
                          <div className="space-y-6">
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-[14px] font-medium text-gray-200">Arrow color</span>
                                  <div className="flex items-center gap-3">
                                      <button onClick={() => setArrowColor("outline")} className={`w-5 h-5 rounded-full border-2 ${arrowColor === 'outline' ? 'border-white' : 'border-gray-500'}`} />
                                      <button onClick={() => setArrowColor("white")} className={`w-5 h-5 rounded-full ${arrowColor === 'white' ? 'bg-white ring-2 ring-white/50 ring-offset-2 ring-offset-[#0A0A0A]' : 'bg-white'}`} />
                                      <button onClick={() => setArrowColor("yellow")} className={`w-5 h-5 rounded-full ${arrowColor === 'yellow' ? 'bg-[#F59E0B] ring-2 ring-[#F59E0B]/50 ring-offset-2 ring-offset-[#0A0A0A]' : 'bg-[#F59E0B]'}`} />
                                  </div>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-[14px] font-medium text-gray-200">Autoplay</span>
                                  <Switch checked={autoplay} onCheckedChange={setAutoplay} className={switchClass} />
                              </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-200">One row slider</span>
                                <Switch checked={oneRowSlider} onCheckedChange={setOneRowSlider} className={switchClass} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-medium text-gray-200">Same height videos</span>
                                <Switch checked={sameHeightVideos} onCheckedChange={setSameHeightVideos} className={switchClass} />
                            </div>
                          </div>
                      </div>
                    )}

                </div>
                
                <div className="p-8 pb-10 border-t border-[#1F1F1F] bg-[#0A0A0A]">
                    <Button
                        onClick={handleSaveAndContinue}
                        disabled={saving}
                        className="w-full bg-white text-black hover:bg-gray-200 py-6 rounded-xl font-bold text-[15px] shadow-lg disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save & Continue"}
                    </Button>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
