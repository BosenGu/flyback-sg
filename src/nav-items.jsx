import Index from './pages/Index';
import ExplorePage from './pages/ExplorePage';
import CommunityPage from './pages/CommunityPage';

export const navItems = [
  {
    to: "/",
    page: <Index />
  },
  {
    to: "/explore",
    page: <ExplorePage />
  },
  {
    to: "/community",
    page: <CommunityPage />
  }
];
