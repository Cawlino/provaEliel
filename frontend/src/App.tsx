import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TaskProvider, useTask } from './contexts/TaskContext'; // Import TaskProvider and useTask
import { Button } from "@/components/ui/button"; // For UI elements
import { Input } from "@/components/ui/input";   // For UI elements
import { Label } from "@/components/ui/label";   // For UI elements
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";


const queryClient = new QueryClient();

// Component for Login and Registration Forms
const AuthPage = () => {
  const { login, register, error, isLoading } = useTask();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // To toggle between login and register

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(username, password);
        // Optionally switch to login form or show success message
        setIsRegistering(false); 
        alert('Cadastro realizado com sucesso! Por favor, faça o login.'); // Translated
      } else {
        await login(username, password);
        // Navigation to '/' will happen due to AppContent's conditional rendering
      }
    } catch (err: any) {
      // Error is already set in context, could display it here or rely on a global error display
      console.error("AuthPage error:", err.message);
      // alert(err.message); // Simple alert for now
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isRegistering ? 'Cadastrar' : 'Entrar'}</CardTitle> {/* Translated */}
          <CardDescription>
            {isRegistering ? 'Crie uma nova conta.' : 'Acesse seu quadro de tarefas.'} {/* Translated */}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label> {/* Translated */}
              <Input 
                id="username" 
                type="text" 
                placeholder="seu_usuario"  // Translated
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label> {/* Translated */}
              <Input 
                id="password" 
                type="password" 
                placeholder="sua_senha"  // Translated
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processando...' : (isRegistering ? 'Cadastrar' : 'Entrar')} {/* Translated */}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={isLoading}
            >
              {isRegistering ? 'Já tem uma conta? Entrar' : "Não tem uma conta? Cadastre-se"} {/* Translated */}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

// Main application content, conditionally rendered based on auth state
const AppContent = () => {
  const { isAuthenticated, logout, isLoading: isAuthLoading } = useTask();

  if (isAuthLoading && !isAuthenticated) { // Show loading indicator only on initial auth check
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Autenticando...</div>; // Translated
  }

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <header style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={logout} variant="outline">Sair</Button> {/* Translated */}
        </header>
      )}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} 
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TaskProvider> {/* TaskProvider wraps everything that needs auth/task context */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent /> {/* AppContent handles routing and auth checks */}
      </TooltipProvider>
    </TaskProvider>
  </QueryClientProvider>
);

export default App;
