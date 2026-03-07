import Testimonial from "../models/Testimonial.js";
import Workspace from "../models/Workspace.js";
import cloudinary from '../config/cloudinary.js'
import streamifier from 'streamifier'

const uploadVideoToCloudinary = (buffer)=>{
    return new Promise ((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {
                folder:"testimonials/videos",
                resource_type:"video"
            },
            (error,result)=>{
                if(error){
                    reject(error)
                }
                else{
                    resolve(result)
                }
            }
        )
        streamifier.createReadStream(buffer).pipe(stream)
    })
};

// Get Public Workspaces 
export const getPublicWorkspace =  async(req,res)=>{
    try{

        const workspace  = await Workspace.findOne({slug:req.params.slug})

        if(!workspace){
            return res.status(404).json({message:"Workspace not found."})
        }
        
        const {name,logo,headerTitle,customMessage,collectName,collectEmail,collectionType,allowStarRating,theme} = workspace;

        return res.status(200).json({
            message:"Workspace fetched correctly on public url.",
             workspace: {
                id: workspace._id,
                name,
                logo,
                headerTitle,
                customMessage,
                collectName,
                collectEmail,
                collectionType,
                allowStarRating,
                theme
            }
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}

// Submit the testimonial
export const submitTestimonial = async(req,res)=>{
    try{

        const workspace  = await Workspace.findOne({slug:req.params.slug})
        if(!workspace){
            return res.status(404).json({message:"Workspace not found."})
        }

        const { type, name, email, rating, message, consent } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!rating) {
            return res.status(400).json({ message: "Rating is required." });
        };
        if (rating < 1 || rating > 5){
            return res.status(400).json({message:"Rating must be from 1 to 5."})
        }


        if(!message || message.length<30){
            return res.status(400).json({message:"Message is of minimum 30 character length"})
        }

        if(!consent){
            return  res.status(400).json({ message: "Consent is required." });
        }

        if(consent !==true && consent !== "true"){
            return  res.status(400).json({ message: "Consent is not true" });
        }

        if(!type || !["text","video"].includes(type)){
            return res.status(400).json({message:"type must be text or video."})
        }

        if(type=="text" && !message){
            return res.status(400).json({message:"message is required."})
        }

        if(type=="video" && !req.file){
            return res.status(400).json({message:"video is required."})
        }

        if (workspace.collectionType === "text" && type === "video"){
            return res.status(400).json({message:"Cant send video with text type."})
        }

        if (workspace.collectionType === "video" && type === "text") {
            return res.status(400).json({message:"Cant send the text with video type."})
        }


        if(email){
            const alreadysubmitted  = await Testimonial.findOne({
                spaceId: workspace._id,
                email: email
            })

            if(alreadysubmitted){
                return res.status(400).json({message:"You have already submitted with thi email."})
            }
        }


        let videoUrl = ""

        if(type == "video" && req.file){
            const ans = await uploadVideoToCloudinary(req.file.buffer)
            videoUrl = ans.secure_url
        }

        const testimonials = await Testimonial.create(
            {
                spaceId: workspace._id,
                type,
                name: name || "",
                email: email || "",
                rating: rating || null,
                message: message || "",
                videoUrl,
                consent: true,
                status: "pending"
            
            },
        )

        return res.status(201).json({
            message:"Testimonial created successfully",
            testimonials
        })
    }

    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
};


