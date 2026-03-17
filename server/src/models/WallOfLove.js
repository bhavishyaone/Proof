import mongoose from "mongoose";

const wallOfLoveSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true
    },

    layout: {
      type: String,
      enum: ["masonry-animated", "masonry-fixed", "carousel"],
      required: true
    },

    darkTheme: {
      type: Boolean,
      default: true
    },

    hideDate: {
      type: Boolean,
      default: true
    },

    hideSourceIcons: {
      type: Boolean,
      default: true
    },

    showClosedCaptions: {
      type: Boolean,
      default: true
    },

    autoplay: {
      type: Boolean,
      default: true
    },

    oneRowSlider: {
      type: Boolean,
      default: true
    },

    sameHeightVideos: {
      type: Boolean,
      default: true
    },

    minimizeImages: {
      type: Boolean,
      default: true
    },

    cardSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "large"
    },

    arrowColor: {
      type: String,
      default: "#000000"
    },

    testimonialOrder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial"
      }
    ]
  },

  { timestamps: true }
);



export default mongoose.model("WallOfLove", wallOfLoveSchema);
