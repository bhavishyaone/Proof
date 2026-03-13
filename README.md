<div align="center">

# Proof

**Turn your customers into your best marketing.** <br/>
Make it incredibly simple to collect video and text testimonials, manage them, and embed them anywhere.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Proof-blue?style=for-the-badge&logo=vercel)](#)

</div>

---

## What is Proof?
* **Testimonial collection made easy:** A platform built to help teams easily gather customer feedback without any friction.
* **Centralized management:** Seamlessly collect text and video testimonials, manage them in one focused dashboard, and organize the best ones.
* **Showcase your success:** Automatically generates a beautiful, embeddable "Wall of Love" code snippet to display your curated testimonials on any website.

## Why was Proof Built?
* **The power of social proof:** Modern businesses thrive on trust. Showing real customers talking about your product significantly boosts conversion rates.
* **Breaking the friction:** Gathering video testimonials is notoriously difficult, usually requiring back-and-forth emails and messy file sharing.
* **Simplified workflow:** Proof was built to provide a zero-friction, dedicated portal where customers can record videos or write text in seconds—directly from their browser.

## What Problem Does It Solve?
* **Elimination of scattered feedback:** Stops the struggle of losing great feedback in endless email threads or social media DMs.
* **Hosting and streaming videos:** Takes the pain out of managing video uploads. Proof handles the heavy lifting of hosting and serving rich media seamlessly.
* **Instant website integration:** Solves the developer bottleneck by instantly providing an iframe/embed snippet so anyone can display a Wall of Love without writing complex UI code.

## Who is Proof For?
* **Target Audience:** Designed for SaaS founders, product teams, freelancers, and growing agencies.
* **The Goal:** To build trust, increase conversion rates, and showcase genuine customer happiness.
* **The Use-Case:** Perfect for anyone looking for an elegant, all-in-one pipeline to harvest and display social proof without paying exorbitant enterprise fees.

## How is Proof Different?
* **Design-First Experience:** Built with a sleek, dark-mode-first aesthetic that ensures your brand always looks premium when asking customers for favors.
* **Granular Control:** Instead of throwing all feedback onto a wall, Proof lets companies filter, curate, and hand-pick only the best 5-star reviews to display.
* **Simplicity at its Core:** No bloated features. Just a clean public submission link, a private dashboard to review submissions, and an embed code output.

---

## 🌟 Key Features

*   **Dual Submission Forms:** Allow customers to easily submit either text or record a video directly from their device.
*   **Customizable Links:** Create tailored Spaces with custom logos, titles, and personalized markdown welcome messages.
*   **Media Hosting:** Robust backend integration with Cloudinary for fast, secure video processing and delivery.
*   **Wall of Love Generator:** Single-click embed codes to drop a gorgeous, responsive grid of testimonials right into your app.
*   **Optional Toggles:** Flexibly enforce or disable the collection of names, emails, and 1-5 star ratings.
*   **Secure Authentication:** Standard Email/Password login combined with seamless Google OAuth SSO.

---

## 🛠️ Tech Stack

This project is organized as a monorepo utilizing a modern JavaScript stack:

### Frontend (`/client`)
*   **Core:** React 19, Vite
*   **Styling:** Tailwind CSS v4, Framer/CSS Animations
*   **Components:** Radix UI, Shadcn UI principles
*   **Routing:** React Router v7
*   **State Management:** React Context API
*   **Icons:** Lucide-React

### Backend (`/server`)
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Media Storage:** Cloudinary, Multer
*   **Auth:** JSON Web Tokens (JWT), Google Auth Library, bcryptjs
*   **Security:** Helmet, CORS

---

## 📂 Project Structure

```text
proof/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── context/        # Auth and Space global state
│   │   ├── lib/            # Axios API interceptors and utilities
│   │   ├── pages/          # Full page routes (Dashboard, EditSpace, WallOfLove, etc.)
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html          # Vite entry point
│   ├── jsconfig.json
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                 # Backend Express API
│   ├── src/
│   │   ├── config/         # DB connection and Cloudinary configurations
│   │   ├── controllers/    # Route business logic (auth, workspaces, walls)
│   │   ├── middlewares/    # Auth guards, multer file upload handlers
│   │   ├── models/         # Mongoose Schemas (User, Workspace, Testimonial, Wall)
│   │   └── routes/         # Express route definitions
│   ├── .env
│   ├── app.js              # Express app setup and middleware
│   ├── package.json
│   └── server.js           # Express instance and application startup
```

---

## Getting Started (Local Development)

Follow these steps to run the entire platform locally on your machine.

### Environment Variables (.env)
You will need to configure these variables in their respective directories before starting the applications:

**Backend (`/server/.env`)**
| Variable | Description |
| :--- | :--- |
| `PORT` | Backend API port (default: 8000) |
| `MONGO_URL` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign Auth tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary credentials for video hosting |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret |
| `BASE_URL` | Backend URL (default: http://localhost:8000) |
| `GOOGLE_CLIENT_ID` | Google OAuth credentials for SSO |

**Frontend (`/client/.env`)**
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend API endpoint |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth credentials for SSO |

### 1. Prerequisites
Make sure you have installed:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
*   [Cloudinary](https://cloudinary.com/) (Account for media storage logic)

### 2. Clone the Repository
```bash
git clone https://github.com/bhavishyaone/proof.git
cd proof
```

### 3. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory and populate it with the variables mentioned above.

Start the server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `/client` directory and populate it with the frontend variables.

Start the frontend:
```bash
npm run dev
```
The dashboard will be running at `http://localhost:5173`.

---

## 📖 Usage Workflow

1. **Create a Space:** Log in and create a new workspace for your product. Give it a title and a custom welcome message.
2. **Share the Link:** Copy your unique Space link and send it to your happy customers.
3. **Customers Submit:** Customers click the link and record a short video or write a text review from any device.
4. **Curate the Inbox:** Log back into Proof, navigate to your Inbox, and review the incoming submissions. Click the heart icon to add the best ones to your Wall of Love.
5. **Embed:** Go to your Wall of Love configuration, generate the embed code, and paste the iframe snippet anywhere on your HTML website or web app!

---

## 🧑‍💻 Author

**Bhavishya Sharma**
*   GitHub: [@bhavishyaone](https://github.com/bhavishyaone)
