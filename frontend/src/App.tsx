import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { TicketsPage } from './pages/TicketsPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
<Route
  path="/"
  element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
/>
<Route
  path="/dashboard"
  element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />}
/>

        <Route
          path="/tickets"
          element={isAuthenticated ? <TicketsPage /> : <Navigate to="/" />}
        />

        <Route
  path="/tickets/new"
  element={isAuthenticated ? <CreateTicketPage /> : <Navigate to="/" />}
/>

<Route
  path="/tickets/:id"
  element={isAuthenticated ? <TicketDetailsPage /> : <Navigate to="/" />}
/>
      </Routes>
    </BrowserRouter>
  );
}