import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { SmoothScroll } from './SmoothScroll';

export function Root() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-black">
        <Navigation />
        <PageTransition>
          <Outlet />
        </PageTransition>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
