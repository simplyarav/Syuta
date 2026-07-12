import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import TransitionWrapper from "@/components/TransitionWrapper";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <TransitionWrapper>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </TransitionWrapper>
      <Footer />
    </>
  );
}
