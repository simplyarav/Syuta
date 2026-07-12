import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SYUTA",
  description: "Learn how we handle and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline mb-8">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4">
            Privacy Policy
          </h1>
          <p className="mt-4 font-bold text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="neo-box p-8 md:p-12 bg-white space-y-10">
          
          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#0055ff]">1. What Data We Collect</h2>
            <div className="font-bold text-lg space-y-3">
              <p>We collect information you provide directly to us when you make a purchase, create an account, or contact support. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Order history and preferences</li>
                <li>Communications with our support team</li>
              </ul>
              <p>We do not store your full credit card details. All payment processing is securely handled by our third-party provider, Razorpay.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#ff3366]">2. How We Use Your Data</h2>
            <div className="font-bold text-lg space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Process and fulfill your orders, including sending shipping updates.</li>
                <li>Provide customer support and handle returns.</li>
                <li>Improve our website, product offerings, and user experience.</li>
                <li>Communicate with you about new drops, sales, and promotions (only if you opt-in).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-[#fce762] bg-black inline-block px-2 shadow-[2px_2px_0px_0px_#000]">3. Third-Party Services</h2>
            <div className="font-bold text-lg space-y-3 mt-2">
              <p>We employ third-party companies and individuals to facilitate our service. These include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Razorpay:</strong> Securely processes all online payments.</li>
                <li><strong>Google/NextAuth:</strong> Handles secure social logins and account authentication.</li>
                <li><strong>Logistics Partners:</strong> Delhivery, BlueDart, etc., for delivering your orders.</li>
              </ul>
              <p>These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4">4. Cookies & Tracking</h2>
            <div className="font-bold text-lg space-y-3">
              <p>
                We use cookies and similar tracking technologies to track the activity on our platform and hold certain information (like keeping your cart active and keeping you logged in). You can instruct your browser to refuse all cookies, but some parts of our site may not function properly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 border-l-[4px] border-black pl-4">5. Contact Us</h2>
            <div className="font-bold text-lg space-y-3">
              <p>
                If you have any questions about this Privacy Policy, wish to request a data export, or want your account deleted, please contact us at:
              </p>
              <p className="inline-block bg-[#f4f4f0] border-[2px] border-black p-3 mt-2">
                privacy@syuta.com
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
