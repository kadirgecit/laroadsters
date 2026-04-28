import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Event } from '../components/Event';
import { Gallery } from '../components/Gallery';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Event />
      <Gallery />
    </>
  );
}
