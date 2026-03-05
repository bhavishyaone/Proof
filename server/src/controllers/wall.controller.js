import Testimonial from "../models/Testimonial.js";
import WallOfLove from "../models/WallOfLove.js";
import Workspace from "../models/Workspace.js";

export const getWallTestimonials = async(req,res)=>{
    try{
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }

        if (workspace.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const testimonial = await Testimonial.find({
            spaceId: req.params.id,
            status: "approved",
            spam: false
        })

        .select("type name rating message videoUrl createdAt")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            total: testimonial.length,
            testimonial
        });

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})

    }
}


export const createWall = async(req,res)=>{

    try{
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }
        if (workspace.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const existingWall = await WallOfLove.findOne({workspaceId:req.params.id})
        if(existingWall){
            return res.status(400).json({message:"Wall already existed."})
        }

        const {layout,testimonialOrder} = req.body

        if (!testimonialOrder || !Array.isArray(testimonialOrder) || testimonialOrder.length === 0){
            return res.status(400).json({message:"At least one testimonial must be selected."})
        }

         const wall = await WallOfLove.create({
            workspaceId: req.params.id,
            layout,
            darkTheme: req.body.darkTheme ?? true,
            hideDate: req.body.hideDate ?? true,
            hideSourceIcons: req.body.hideSourceIcons ?? true,
            showClosedCaptions: req.body.showClosedCaptions ?? true,
            autoplay: req.body.autoplay ?? true,
            showMoreButton: req.body.showMoreButton ?? true,
            oneRowSlider: req.body.oneRowSlider ?? true,
            sameHeightVideos: req.body.sameHeightVideos ?? true,
            minimizeImages: req.body.minimizeImages ?? true,
            cardSize: req.body.cardSize || "large",
            arrowColor: req.body.arrowColor || "#000000",
            testimonialOrder
        });

        return res.status(201).json({
            message: "Wall of Love created.",
            wall
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})

    }
}


export const getWall = async(req,res)=>{
    try{
        const workspace = await Workspace.findById(req.params.id);
        
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found." });
        }

        if (workspace.owner.toString() !== req.user) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const wall = await WallOfLove.findOne({ workspaceId: req.params.id });
        if (!wall) {
            return res.status(200).json({ message: "Wall not created yet." });
        }

        return res.status(200).json({ wall});
    
    }

    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}

export const updateWall = async (req, res) => {
  try {

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    if (workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const allowedFields = [
      "layout",
      "darkTheme",
      "hideDate",
      "hideSourceIcons",
      "showClosedCaptions",
      "autoplay",
      "showMoreButton",
      "oneRowSlider",
      "sameHeightVideos",
      "minimizeImages",
      "cardSize",
      "arrowColor",
      "testimonialOrder"
    ];

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty." });
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.layout && !["masonry-animated", "masonry-fixed", "carousel", "animated", "fixed"].includes(updates.layout)) {
      return res.status(400).json({ message: "Invalid layout." });
    }

    if (updates.cardSize && !["small", "medium", "large"].includes(updates.cardSize)) {
      return res.status(400).json({ message: "Invalid card size." });
    }

    const updated = await WallOfLove.findOneAndUpdate(
      { workspaceId: req.params.id },
      { $set: { ...updates, workspaceId: req.params.id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Wall saved.",
      wall: updated
    });

  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};


export const reorderWall = async (req, res) => {

  try {

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    if (workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const wall = await WallOfLove.findOne({ workspaceId: req.params.id });
    if (!wall) {
      return res.status(404).json({ message: "Wall not found." });
    }

    const { testimonialOrder } = req.body;
    if (!testimonialOrder || !Array.isArray(testimonialOrder) || testimonialOrder.length === 0) {
      return res.status(400).json({ message: "Testimonial order array is required." });
    }

    const updated = await WallOfLove.findByIdAndUpdate(
      wall._id,
      { $set: { testimonialOrder } },
      { returnDocument: "after" }
    );
    
    return res.status(200).json({ message: "Wall order updated.", wall: updated });
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};



export const getEmbedData = async (req, res) => {
  try {

    const wall = await WallOfLove.findById(req.params.wallId);
    if (!wall) {
      return res.status(404).json({ message: "Wall not found." });
    }
   
    const testimonials = await Testimonial.find({
      _id: { $in: wall.testimonialOrder },
      status: "approved",
      spam: false,
      archived: false
    }).select("type name rating message videoUrl createdAt");
   
    
    const orderMap = {};
    wall.testimonialOrder.forEach((id, index) => {
      orderMap[id.toString()] = index;
    });

    const sortedTestimonials = testimonials.sort((a, b) => {
      return orderMap[a._id.toString()] - orderMap[b._id.toString()];
    });

    return res.status(200).json({
      config: {
        layout: wall.layout,
        darkTheme: wall.darkTheme,
        hideDate: wall.hideDate,
        hideSourceIcons: wall.hideSourceIcons,
        showClosedCaptions: wall.showClosedCaptions,
        autoplay: wall.autoplay,
        showMoreButton: wall.showMoreButton,
        oneRowSlider: wall.oneRowSlider,
        sameHeightVideos: wall.sameHeightVideos,
        minimizeImages: wall.minimizeImages,
        cardSize: wall.cardSize,
        arrowColor: wall.arrowColor
      },
      testimonials: sortedTestimonials
    });

  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};


export const getEmbedCode = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    if (workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }
    const wall = await WallOfLove.findOne({ workspaceId: req.params.id });
    if (!wall) {
      return res.status(404).json({ message: "Wall not created yet." });
    }
    const embedCode = `<script type="text/javascript" src="${process.env.BASE_URL}/js/iframeResizer.min.js"></script>
                       \n<iframe id='testimonial-${wall._id}' src="${process.env.BASE_URL}/embed/${wall._id}" frameborder="0" scrolling="no" width="100%"></iframe>
                       \n<script type="text/javascript">iFrameResize({log: false, checkOrigin: false}, '#testimonial-${wall._id}');</script>`;
    return res.status(200).json({ embedCode });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};



export const deleteWall = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }
    if (workspace.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const wall = await WallOfLove.findOne({ workspaceId: req.params.id });
    if (!wall) {
      return res.status(404).json({ message: "Wall not found." });
    }

    await WallOfLove.findByIdAndDelete(wall._id);
    return res.status(200).json({ message: "Wall deleted." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};


