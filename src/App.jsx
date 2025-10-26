import { useRef } from 'react';
import Hero from './components/Hero';
import Courses from './components/Courses';
import PrePurchaseForm from './components/PrePurchaseForm';
import Payment from './components/Payment';

function App() {
  const formRef = useRef(null);
  const paymentRef = useRef(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToPayment = () => {
    if (paymentRef.current) {
      paymentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-violet-500/40 selection:text-white">
      <Hero onGetAccess={scrollToForm} />
      <main className="relative z-10">
        <section id="courses" className="container mx-auto px-4 py-16">
          <Courses onBuy={scrollToForm} />
        </section>
        <section id="prepurchase" ref={formRef} className="container mx-auto px-4 py-16">
          <PrePurchaseForm onGoToPayment={scrollToPayment} />
        </section>
        <section id="payment" ref={paymentRef} className="container mx-auto px-4 py-16">
          <Payment />
        </section>
      </main>
      <footer className="border-t border-white/10 py-8 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <p>© {new Date().getFullYear()} AI Creator Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#prepurchase" className="hover:text-white transition-colors">Pre-Purchase</a>
            <a href="#payment" className="hover:text-white transition-colors">Payment</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
