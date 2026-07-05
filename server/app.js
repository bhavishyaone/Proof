import express from 'express';
import cors from 'cors'
import helmet from 'helmet'

import authRoutes from "./src/routes/auth.routes.js";
import workspaceRoutes from './src/routes/workspace.routes.js'
import publicRoutes from './src/routes/public.routes.js'
import testimonialRoutes from './src/routes/testimonial.routes.js'
import wallRoutes from './src/routes/wall.routes.js'


const app  = express()

app.use(cors({
  origin: [
    'https://proof-night-phi.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Handle preflight requests for all routes
app.options('/(.*)', cors({
  origin: [
    'https://proof-night-phi.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: false, // Allow cross-origin resource sharing
}))
app.use(express.json())

app.use("/auth",authRoutes)
app.use("/workspace",workspaceRoutes)
app.use("/public",publicRoutes)
app.use("/",testimonialRoutes)
app.use("/", wallRoutes);

app.get("/",(req,res)=>{
    return res.status(200).json({message:"server start ho gaya finally."})
})

export default app;
