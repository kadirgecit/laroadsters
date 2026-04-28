import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { SwapMeet } from './pages/SwapMeet';
import { AboutUs } from './pages/AboutUs';
import { MemberNews } from './pages/MemberNews';
import { PhotoGallery } from './pages/PhotoGallery';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'news', Component: News },
      { path: 'swap-meet', Component: SwapMeet },
      { path: 'about', Component: AboutUs },
      { path: 'member-news', Component: MemberNews },
      { path: 'gallery', Component: PhotoGallery },
    ],
  },
]);
