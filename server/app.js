import express from 'express';
import cors from 'cors'
import helmet from 'helmet'

import authRoutes from "./src/routes/auth.routes.js";
import workspaceRoutes from './src/routes/workspace.routes.js'
import publicRoutes from './src/routes/public.routes.js'
import testimonialRoutes from './src/routes/testimonial.routes.js'
import wallRoutes from './src/routes/wall.routes.js'


const app  = express()

// Manual CORS headers — must be first, before all other middleware
const ALLOWED_ORIGINS = [
  'https://proof-night-phi.vercel.app',
  'http://localhost:5173',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // Respond immediately to preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: false,
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
