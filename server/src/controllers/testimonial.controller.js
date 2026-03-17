import Testimonial from "../models/Testimonial.js";
import Workspace from "../models/Workspace.js";
import cloudinary from "../config/cloudinary.js";

export const getTestimonial = async(req,res)=>{
    try{
        const workspace = await Workspace.findById(req.params.id)

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }

        if (workspace.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const filter = { spaceId: req.params.id };
        if (req.query.type) filter.type = req.query.type;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.liked === "true") filter.liked = true;
        if (req.query.archived === "true") filter.archived = true;
        if (req.query.spam === "true") filter.spam = true;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Testimonial.countDocuments(filter);
        const testimonials = await Testimonial.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            testimonials
            
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}    

export const approveTestimonial  = async(req,res)=>{
    try{
        const testimonial = await Testimonial.findById(req.params.id)
         if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }
        const workspace = await Workspace.findById(testimonial.spaceId)

        if (!workspace || workspace.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const updated = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { $set: { status: "approved" } },
            { returnDocument: 'after' }
        );

        return res.status(200).json({ message: "Testimonial approved.", testimonial: updated });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}

export const rejectTestimonial = async (req, res) => {

  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const workspace = await Workspace.findById(testimonial.spaceId);

    if (!workspace || workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "rejected" } },
      { returnDocument: 'after' }
    );
    
    return res.status(200).json({ message: "Testimonial rejected.", testimonial: updated });
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const likeTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const workspace = await Workspace.findById(testimonial.spaceId);

    if (!workspace || workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: { liked: !testimonial.liked } },
      {  returnDocument: 'after' }
    );

    return res.status(200).json({
      message: updated.liked ? "Testimonial liked." : "Testimonial unliked.",
      testimonial: updated
    });

  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const archiveTestimonial = async (req, res) => {
  try {

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const workspace = await Workspace.findById(testimonial.spaceId);

    if (!workspace || workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: { archived: !testimonial.archived } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({
      message: updated.archived ? "Testimonial archived." : "Testimonial unarchived.",
      testimonial: updated
    });
    
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const markSpam = async (req, res) => {

  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const workspace = await Workspace.findById(testimonial.spaceId);

    if (!workspace || workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: { spam: !testimonial.spam } },
      { returnDocument: 'after'  }
    );

    return res.status(200).json({
      message: updated.spam ? "Marked as spam." : "Unmarked as spam.",
      testimonial: updated
    });

  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const workspace = await Workspace.findById(testimonial.spaceId);

    if (!workspace || workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (testimonial.videoUrl) {

    const parts = testimonial.videoUrl.split("/");
    const fileName = parts[parts.length - 1].split(".")[0]; 
    const folder = parts[parts.length - 2]; 
    const parentFolder = parts[parts.length - 3]; 
    const publicId = `${parentFolder}/${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}
    await Testimonial.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Testimonial deleted." });

  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};


