import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import LandingView from '@/pages/LandingView';
import LoginView from '@/pages/LoginView';
import RegisterView from '@/pages/RegisterView';
import ProfileView from '@/pages/ProfileView';
import ComponentsView from '@/pages/ComponentsView';

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingView />
      },
      {
        path: 'landing',
        element: <LandingView />
      },
      {
        path: 'login',
        element: <LoginView />
      },
      {
        path: 'register',
        element: <RegisterView />
      },
      {
        path: 'components',
        element: <ComponentsView />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <ProfileView />
          }
        ]
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}