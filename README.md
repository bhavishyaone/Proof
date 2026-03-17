<div align="center">

# Proof

**Turn your customers into your best marketing.** <br/>
Collect video and text testimonials in minutes, manage everything in one place, and embed them anywhere.

[Live Demo](#)

</div>

---

## About Proof
Proof is built to make testimonial collection simple, fast, and actually usable day to day.

* **What it does:** Gives you a clean public link where people can share text or video testimonials.
* **Why it exists:** Collecting testimonials the old way usually means scattered messages, file links, and too much back-and-forth.
* **Who it is for:** Founders, product teams, freelancers, and agencies who want stronger social proof.
* **How it helps:** Brings submissions into one dashboard, handles video hosting, and gives you an easy Wall of Love embed.
* **What makes it different:** It stays focused. You get control over what goes live, without a bloated workflow.

---

## Screenshots

### Landing Page
![Landing Page](./Images/Landing%20Page.png)

### Dashboard Page
![Dashboard Page](./Images/Dashboard%20Page.png)

### Inbox Page
![Inbox Page](./Images/Inbox%20page.png)

### Edit Space
![Edit Space](./Images/Edit%20Space.png)

### Wall of Configuarations
![Wall of Configuarations](./Images/Wall%20of%20Configuarations.png)

---

## Key Features

*   **Dual Submission Forms:** People can either write a testimonial or record a video right from their device.
*   **Customizable Links:** Set up Spaces with your own logo, title, and markdown welcome message.
*   **Media Hosting:** Cloudinary integration handles video processing and delivery quickly and securely.
*   **Wall of Love Generator:** Generate an embed code in one click and drop a responsive testimonial grid into your app.
*   **Optional Toggles:** Decide whether to collect names, emails, and 1-5 star ratings.
*   **Secure Authentication:** Supports email/password login and Google OAuth SSO.

---

## Tech Stack

This project is set up with a modern JavaScript stack:

### Frontend (`/client`)
*   **Core:** React 19, Vite
*   **Styling:** Tailwind CSS v4, Framer/CSS Animations
*   **Components:** Radix UI, Shadcn UI principles
*   **Routing:** React Router
*   **State Management:** React Context API
*   **UI Assets:** Lucide-React

### Backend (`/server`)
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Media Storage:** Cloudinary, Multer
*   **Auth:** JSON Web Tokens (JWT), Google Auth Library, bcryptjs
*   **Security:** Helmet, CORS

---

## Project Structure

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

Follow these steps to run the full platform locally.

### Environment Variables (.env)
Before you start, add these variables in their respective directories:

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
Make sure you have the following installed:
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
Create a `.env` file in `/server` and add the backend variables listed above.

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
Create a `.env` file in `/client` and add the frontend variables listed above.

Start the frontend:
```bash
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

---

## Usage Workflow

1. **Create a Space:** Log in, create a workspace for your product, and add a title and welcome message.
2. **Share the Link:** Copy your Space link and send it to your customers.
3. **Customers Submit:** Customers open the link and share a short video or text review from any device.
4. **Curate the Inbox:** Review incoming submissions and mark the ones you want on your Wall of Love.
5. **Embed:** Open Wall of Love settings, generate the embed code, and paste the iframe snippet into your website or web app.

---

## Author

**Bhavishya Sharma**
*   GitHub: [@bhavishyaone](https://github.com/bhavishyaone)
