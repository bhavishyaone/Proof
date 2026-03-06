import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function EmbedWall() {
  const { wallId } = useParams();
  const [config, setConfig] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchWall = async () => {
      try {
        const res = await api.get(`/embed/${wallId}`);
        setConfig(res.data.config);
        setTestimonials(res.data.testimonials || []);
      } catch (err) {
        setError("Wall not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (wallId) fetchWall();
  }, [wallId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-gray-500 text-sm">{error || "Wall unavailable."}</p>
      </div>
    );
  }

  const {
    layout = "animated",
    darkTheme = true,
    cardSize = "medium",
    hideDate = false,
    hideSourceIcons = false,
    minimizeImages = false,
    showMoreButton = true,
    arrowColor = "white",
  } = config;

  const bg = darkTheme ? "#0A0A0A" : "#FAFAFA";
  const cardBg = darkTheme ? "#151515" : "#FFFFFF";
  const cardBorder = darkTheme ? "#222222" : "#E5E7EB";
  const textPrimary = darkTheme ? "#FFFFFF" : "#111111";
  const textSecondary = darkTheme ? "#9CA3AF" : "#6B7280";
  const avatarBg = darkTheme ? "#2A2A2A" : "#E5E7EB";
  const padding = cardSize === "small" ? "12px" : cardSize === "large" ? "28px" : "20px";
  const fontSize = cardSize === "small" ? "12px" : cardSize === "large" ? "16px" : "14px";

  const arrowBg =
    arrowColor === "white"
      ? { background: "#FFFFFF", color: "#000000" }
      : arrowColor === "yellow"
      ? { background: "#F59E0B", color: "#000000" }
      : { background: "transparent", color: darkTheme ? "#FFFFFF" : "#111111", border: "1px solid currentColor" };

  const isAnimated = layout === "animated" || layout === "masonry-animated";
  const isCarousel = layout === "carousel";

  const renderCard = (t, extraStyle = {}) => (
    <div
      key={t._id}
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: "16px",
        padding,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        marginBottom: "16px",
        ...extraStyle,
      }}
    >

      <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
        {Array(t.rating || 5).fill(0).map((_, i) => (
          <span key={i} style={{ color: "#F59E0B", fontSize: "14px" }}>★</span>
        ))}
        {Array(5 - (t.rating || 5)).fill(0).map((_, i) => (
          <span key={i} style={{ color: "#4B5563", fontSize: "14px" }}>★</span>
        ))}
      </div>


      {t.type === "video" && t.videoUrl ? (
        <video
          src={t.videoUrl}
          controls
          style={{ width: "100%", borderRadius: "10px", marginBottom: "12px", maxHeight: "200px", objectFit: "cover" }}
        />
      ) : (
        <p
          style={{
            fontSize,
            color: darkTheme ? "#D1D5DB" : "#374151",
            lineHeight: "1.6",
            marginBottom: "14px",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          &ldquo;{t.message}&rdquo;
        </p>
      )}


      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!minimizeImages && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: avatarBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "700",
              color: textPrimary,
              flexShrink: 0,
            }}
          >
            {t.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontWeight: "700", fontSize, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t.name}
            </p>
            {!hideSourceIcons && (
              <div style={{ width: "12px", height: "12px", background: darkTheme ? "#333" : "#D1D5DB", borderRadius: "3px", marginLeft: "8px", flexShrink: 0 }} />
            )}
          </div>
          {!hideDate && (
            <p style={{ fontSize: "11px", color: textSecondary, marginTop: "2px" }}>
              {formatDate(t.createdAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );


  if (isCarousel) {
    const prev = () => setCarouselIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    const next = () => setCarouselIndex((i) => (i + 1) % testimonials.length);

    return (
      <div style={{ background: bg, minHeight: "100vh", padding: "40px 24px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={{ maxWidth: "520px", margin: "0 auto", position: "relative" }}>
          {testimonials.length > 0 && renderCard(testimonials[carouselIndex])}

          {testimonials.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
              <button
                onClick={prev}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", ...arrowBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
              >
                ‹
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                {testimonials.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === carouselIndex ? (darkTheme ? "#FFFFFF" : "#111111") : (darkTheme ? "#333333" : "#D1D5DB"), cursor: "pointer", transition: "background 0.2s" }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", ...arrowBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }


  const leftCol = testimonials.filter((_, i) => i % 2 === 0);
  const rightCol = testimonials.filter((_, i) => i % 2 === 1);

  const floatStyle = isAnimated
    ? { animation: "wallFloat 3s ease-in-out infinite" }
    : {};

  const floatDelays = ["0s", "0.8s", "0.4s", "1.2s", "1.6s", "0.6s"];

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "40px 24px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes wallFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

          <div style={{ paddingTop: "40px" }}>
            {leftCol.map((t, i) =>
              renderCard(t, isAnimated ? { ...floatStyle, animationDelay: floatDelays[i * 2] || "0s" } : {})
            )}
          </div>


          <div>
            {rightCol.map((t, i) =>
              renderCard(t, isAnimated ? { ...floatStyle, animationDelay: floatDelays[i * 2 + 1] || "0.4s" } : {})
            )}
          </div>
        </div>

        {showMoreButton && testimonials.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
            <button
              style={{
                padding: "10px 28px",
                borderRadius: "10px",
                border: `1px solid ${cardBorder}`,
                background: cardBg,
                color: textPrimary,
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
