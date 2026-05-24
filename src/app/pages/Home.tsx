import { Hero } from '../components/Hero';
import { Event } from '../components/Event';
import { About } from '../components/About';
import { Gallery } from '../components/Gallery';

export function Home() {
  return (
    <>
      <Hero />
      <Event />
      <About />
      <Gallery />
    </>
  );
}
