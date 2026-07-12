import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await authRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { message: "Too many requests, please try again later." },
          { status: 429 }
        );
      }
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Security: Do not reveal that the email exists to prevent enumeration attacks
      return NextResponse.json(
        { message: "Registration successful" },
        { status: 201 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verificationToken,
      verificationTokenExpires,
    });

    // Send email (must await in Vercel serverless functions)
    const { sendVerificationEmail } = await import("@/lib/mailer");
    await sendVerificationEmail(user.email, user.verificationToken);

    return NextResponse.json(
      { message: "Please check your email to verify your account.", user: { id: user._id, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
