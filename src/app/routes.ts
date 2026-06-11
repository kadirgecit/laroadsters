import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { AboutUs } from './pages/AboutUs';
import { Members } from './pages/Members';
import { PhotoGallery } from './pages/PhotoGallery';
import { Contact } from './pages/Contact';
import { AdminLogin, AdminDashboard } from './admin/Admin';
import { AdminNewsCards } from './admin/AdminNewsCards';
import { AdminFlyer } from './admin/AdminFlyer';
import { AdminSponsors } from './admin/AdminSponsors';
import { AdminDocuments } from './admin/AdminDocuments';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'news', Component: News },
      { path: 'about', Component: AboutUs },
      { path: 'member-news', Component: Members },
      { path: 'gallery', Component: PhotoGallery },
      { path: 'contact', Component: Contact },
    ],
  },
  // Admin lives outside the public Root layout (no nav/footer).
  {
    path: '/admin',
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'login', Component: AdminLogin },
      { path: 'news-cards', Component: AdminNewsCards },
      { path: 'flyer', Component: AdminFlyer },
      { path: 'sponsors', Component: AdminSponsors },
      { path: 'documents', Component: AdminDocuments },
    ],
  },
]);
