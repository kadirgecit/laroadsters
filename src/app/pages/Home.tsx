import { Hero } from '../components/Hero';
import { Event } from '../components/Event';
import { About } from '../components/About';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <>
      <Hero />
      <Event />
      <About />
      <Footer />
    </>
  );
}
