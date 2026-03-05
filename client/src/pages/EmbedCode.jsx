import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox, Heart, Edit, Share2, Copy, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpaceContext } from "../context/SpaceContext";
import api from "../lib/api";

export default function EmbedCode() {
  const { activeSpace } = useContext(SpaceContext);
  const spaceName = activeSpace?.name || "My Space";
  const spaceInitial = spaceName.charAt(0).toUpperCase();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wall, setWall] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [embedCode, setEmbedCode] = useState("");

  useEffect(() => {
    if (!activeSpace?._id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [wallResult, testimonialResult] = await Promise.allSettled([
          api.get(`/workspace/${activeSpace._id}/wall`),
          api.get(`/workspace/${activeSpace._id}/testimonials?status=approved`),
        ]);

        const wallData = wallResult.status === "fulfilled" ? wallResult.value.data.wall : null;
        const testimonialData = testimonialResult.status === "fulfilled" ? testimonialResult.value.data.testimonials : [];

        setWall(wallData);
        setTestimonials(testimonialData?.slice(0, 3) || []);

        const origin = window.location.origin;
        if (wallData) {
          setEmbedCode(
            `<!-- Proof Wall of Love -->\n<script src="${origin}/widget.js"></script>\n<iframe\n  id="proof-wall-${wallData._id}"\n  src="${origin}/embed/${wallData._id}"\n  frameborder="0"\n  scrolling="no"\n  width="100%"\n  height="600"\n></iframe>\n<script>\n  iFrameResize({ checkOrigin: false }, '#proof-wall-${wallData._id}');\n</script>`
          );
        } else {
          const origin = window.location.origin;
          setEmbedCode(
            `<!-- Proof Wall of Love -->\n<!-- Create your Wall from the Wall of Love page first! -->\n<iframe\n  src="${origin}/embed/${activeSpace?.slug}"\n  frameborder="0"\n  width="100%"\n  height="600"\n></iframe>`
          );
        }
      } catch (_) {
        const origin = window.location.origin;
        setEmbedCode(
          `<!-- Proof Wall of Love -->\n<iframe\n  src="${origin}/embed/${activeSpace?.slug}"\n  frameborder="0"\n  width="100%"\n  height="600"\n></iframe>`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSpace?._id]);

  const darkTheme = wall?.darkTheme ?? true;
  const cardSize = wall?.cardSize || "medium";
  const hideDate = wall?.hideDate ?? false;
  const minimizeImages = wall?.minimizeImages ?? false;
  const layout = wall?.layout || "animated";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 604800)}w`;
  };

  const renderCard = (t, animStyle = {}) => (
    <div
      key={t._id}
      style={animStyle}
      className={`border rounded-xl shadow-md ${darkTheme ? "bg-[#151515] border-[#222]" : "bg-white border-gray-200"} ${cardSize === "small" ? "p-3" : cardSize === "large" ? "p-5" : "p-4"}`}
    >
      <div className="flex gap-0.5 mb-2">
        {Array(t.rating || 5).fill(0).map((_, i) => (
          <span key={i} className={`text-xs ${darkTheme ? "text-[#F59E0B]" : "text-yellow-400"}`}>★</span>
        ))}
        {Array(5 - (t.rating || 5)).fill(0).map((_, i) => (
          <span key={i} className="text-gray-400 text-xs">★</span>
        ))}
      </div>
      {t.type === "video" && t.videoUrl ? (
        <video src={t.videoUrl} controls className="w-full rounded-lg mb-3 max-h-24 object-cover" />
      ) : (
        <p className={`text-xs leading-relaxed mb-3 line-clamp-3 ${darkTheme ? "text-gray-300" : "text-gray-700"}`}>
          &quot;{t.message}&quot;
        </p>
      )}
      <div className="flex items-center gap-2">
        {!minimizeImages && (
          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${darkTheme ? "bg-[#2A2A2A] text-white" : "bg-gray-200 text-gray-700"}`}>
            {t.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className={`text-xs font-bold truncate ${darkTheme ? "text-white" : "text-gray-900"}`}>{t.name}</p>
          {!hideDate && (
            <p className={`text-[10px] ${darkTheme ? "text-gray-600" : "text-gray-400"}`}>{formatDate(t.createdAt)}</p>
          )}
        </div>
      </div>
    </div>
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] font-sans text-white overflow-hidden">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col h-full flex-shrink-0 hidden md:flex border-r border-[#1F1F1F]">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">Proof</h1>
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-8 px-3 py-2.5 bg-[#1F1F1F] rounded-xl border border-[#2A2A2A]">
            <div className="w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center text-sm font-bold font-serif text-white overflow-hidden">
              {activeSpace?.logo ? <img src={activeSpace.logo} alt="logo" className="w-full h-full object-cover" /> : spaceInitial}
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
          <h2 className="text-[12px] font-bold text-white uppercase tracking-widest">Embed Code</h2>
        </header>

        <div className="flex-1 flex items-center justify-center bg-black/60 p-8 overflow-y-auto">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => navigate("/wall-of-love")}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Your Wall of Love is Ready! 🎉</h1>
              <p className="text-sm text-gray-400">Copy the code below and paste it on any website.</p>
            </div>


            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 mb-6 relative group">
              {loading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <p className="text-xs text-gray-500 font-mono">Generating embed code...</p>
                </div>
              ) : (
                <pre className="text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-wrap overflow-hidden">
                  {embedCode}
                </pre>
              )}
              <button
                onClick={handleCopy}
                disabled={loading}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-[#1E1E1E] hover:bg-[#2A2A2A] text-gray-500 hover:text-gray-200 transition-all opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>


            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Preview</p>
              <div className={`border border-[#2A2A2A] rounded-xl p-4 ${darkTheme ? "bg-[#0D0D0D]" : "bg-gray-50"}`}>
                {loading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                ) : testimonials.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-6">No approved testimonials to preview</p>
                ) : layout === "carousel" ? (
                  <>
                    <style>{`@keyframes previewFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
                    <div className="flex gap-3 overflow-hidden justify-center">
                      {testimonials.slice(0, 1).map((t) => renderCard(t))}
                    </div>
                  </>
                ) : (
                  <>
                    {layout === "animated" && (
                      <style>{`@keyframes previewFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
                    )}
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-3">
                        {testimonials.slice(0, 2).map((t, i) =>
                          renderCard(
                            t,
                            layout === "animated"
                              ? { animation: "previewFloat 3s ease-in-out infinite", animationDelay: `${i * 0.8}s` }
                              : {}
                          )
                        )}
                      </div>
                      {testimonials.length > 2 && (
                        <div className="flex-1 space-y-3 mt-4">
                          {testimonials.slice(2, 3).map((t) =>
                            renderCard(
                              t,
                              layout === "animated"
                                ? { animation: "previewFloat 3s ease-in-out infinite", animationDelay: "0.4s" }
                                : {}
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>


            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/wall-of-love")}
                variant="outline"
                className="flex-1 border-[#2A2A2A] bg-transparent text-white hover:bg-[#1A1A1A] hover:text-white py-6 rounded-xl font-bold text-[15px]"
              >
                Done
              </Button>
              <Button
                onClick={handleCopy}
                disabled={loading || !embedCode}
                className="flex-1 bg-white text-black hover:bg-gray-200 py-6 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {loading ? "Loading..." : "Copy Code"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
