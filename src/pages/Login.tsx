
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ALL_BRANCHES, BranchId } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PillIcon, AlertTriangleIcon } from 'lucide-react';
import { isSupabaseConfigured } from "@/lib/supabase";

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<BranchId | "">("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const supabaseConfigured = isSupabaseConfigured();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranch) {
      toast.error("Erro", {
        description: "Selecione uma filial"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting login with branch:", selectedBranch);
      const success = await login(selectedBranch, password);
      
      if (success) {
        toast.success(`Login bem-sucedido`, {
          description: `Bem-vindo, ${selectedBranch}!`
        });
        navigate("/dashboard");
      } else {
        toast.error("Erro de autenticação", {
          description: "Filial ou senha incorreta. A senha deve ser o mesmo nome da filial."
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login", {
        description: "Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pharma-100 to-pharma-50 p-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-pharma-600 text-white rounded-full mb-4">
            <PillIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-pharma-800 text-center">Esteio Pharma Flow</h1>
          <p className="text-pharma-600 mt-2 text-center">Sistema de Transferências entre Filiais</p>
        </div>

        {!supabaseConfigured && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-3">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              O Supabase não está configurado corretamente. Para fins de teste, use o mesmo nome da filial como senha.
            </p>
          </div>
        )}

        <Card className="shadow-lg border-pharma-200">
          <CardHeader>
            <CardTitle>Login de Filial</CardTitle>
            <CardDescription>
              Acesse o sistema com suas credenciais de filial
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Filial</Label>
                <Select
                  value={selectedBranch}
                  onValueChange={(value) => setSelectedBranch(value as BranchId)}
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Selecione sua filial" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Dica: Para fins de teste, a senha é o mesmo nome da filial.
        </p>
      </div>
    </div>
  );
};

export default Login;
