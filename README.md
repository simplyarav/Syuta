# SYUTA. | Premium Streetwear

**Live Website:** [https://syuta.vercel.app/](https://syuta.vercel.app/)

A modern, high-performance e-commerce platform for premium streetwear, built with Next.js and MongoDB.

## 🚀 Features

- **Dynamic E-Commerce Experience:** Fully responsive layout with neo-brutalism aesthetics.
- **Authentication & Security:** JWT-based authentication with NextAuth.js. Secure email verification using Nodemailer and Gmail SMTP.
- **Real-Time Shopping Cart:** Persistent global state using Zustand.
- **Advanced Search & Filtering:** Instantly search products with MongoDB regex indexing. 
- **Admin Dashboard:** Manage products, inventory, and incoming orders seamlessly.
- **Secure Checkout:** Integrated payments processing with Razorpay.
- **Rate Limiting:** Enterprise-grade API protection via Upstash Redis.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend:** Next.js Server Actions & API Routes, Node.js
- **Database:** MongoDB (Mongoose)
- **State Management:** Zustand
- **Authentication:** NextAuth.js, bcryptjs
- **Email:** Nodemailer (SMTP)
- **Deployment:** Vercel

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB connection string
- Gmail account (for SMTP App Passwords)

### Environment Variables

Create a `.env.local` file in the root directory and add your credentials:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email Verification (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_16_char_app_password

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simplyarav/Syuta.git
   cd Syuta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database (Optional)**
   If you want to populate the store with sample products:
   ```bash
   node scripts/seed.js
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎨 Design System

The platform uses a distinctive neo-brutalist aesthetic:
- **Colors:** Vibrant accents (`#fce762` yellow, `#ff3366` pink) against stark black and white.
- **Typography:** Heavy, uppercase typography using `font-black` and extreme tracking (`tracking-tighter`).
- **UI Components:** Sharp corners, thick borders (`border-[3px] border-black`), and solid black drop shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).

## 📄 License

This project is licensed under the MIT License.
