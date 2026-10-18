import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DistrictsPage } from './pages/DistrictsPage';
import { DistrictDetailPage } from './pages/DistrictDetailPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { InteractiveMapPage } from './pages/InteractiveMapPage';
import { TripsPage } from './pages/TripsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NearbyPage } from './pages/NearbyPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { HiddenGemsPage } from './pages/HiddenGemsPage';
import { SearchPage } from './pages/SearchPage';
import { SafetyPage } from './pages/SafetyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'districts', element: <DistrictsPage /> },
      { path: 'district/:slug', element: <DistrictDetailPage /> },
      { path: 'destination/:slug', element: <DestinationDetailPage /> },
      { path: 'map', element: <InteractiveMapPage /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'nearby', element: <NearbyPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'category/:slug', element: <CategoryDetailPage /> },
      { path: 'hidden-gems', element: <HiddenGemsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'safety', element: <SafetyPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
