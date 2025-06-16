
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/providers/AppProvider";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NewTransfer from "@/pages/NewTransfer";
import TransferDetail from "@/pages/TransferDetail";
import History from "@/pages/History";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const App = () => (
  <AppProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/new-transfer" element={
          <ProtectedRoute>
            <NewTransfer />
          </ProtectedRoute>
        } />
        
        <Route path="/transfer/:id" element={
          <ProtectedRoute>
            <TransferDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
