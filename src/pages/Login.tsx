import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, BookOpen, Trophy, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // UPDATED: Logic to handle confirmed emails that haven't synced locally
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // Attempt to refresh the session to see if the user is now confirmed
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData.user?.email_confirmed_at) {
            toast({
              title: "Login Successful",
              description: "Session synced. Welcome to Prep Master!",
            });
            navigate("/dashboard");
            return;
          }
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Prep Master!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-primary-hover rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-outfit font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2">
              Prep Master
            </h1>
            <p className="text-muted-foreground font-inter text-lg">Welcome back, future achiever!</p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-outfit font-bold text-center text-foreground">
                Sign In
              </CardTitle>
              <CardDescription className="text-center font-inter text-base text-muted-foreground">
                Continue your preparation journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="font-inter font-semibold text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="font-inter h-12 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="font-inter font-semibold text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-inter h-12 bg-background/50 border-border/50 focus:bg-background transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary-hover font-inter font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full font-inter h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-inter">New to Prep Master?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary-hover font-inter font-semibold text-base transition-colors"
                >
                  Create your free account
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground font-inter transition-colors inline-flex items-center gap-2"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Highlights */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-hover p-8 text-primary-foreground">
        <div className="flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-outfit font-bold mb-4">Join 10,000+ Students</h2>
            <p className="text-xl text-primary-foreground/90 font-inter leading-relaxed">
              Master your entrance exams with our comprehensive preparation platform
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl"><BookOpen className="w-6 h-6" /></div>
              <div>
                <h3 className="font-outfit font-semibold text-lg mb-2">Expert Content</h3>
                <p className="text-primary-foreground/80 font-inter">Curated notes and materials by top educators</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl"><Trophy className="w-6 h-6" /></div>
              <div>
                <h3 className="font-outfit font-semibold text-lg mb-2">Practice Tests</h3>
                <p className="text-primary-foreground/80 font-inter">Thousands of questions with detailed explanations</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <h3 className="font-outfit font-semibold text-lg mb-2">Success Community</h3>
                <p className="text-primary-foreground/80 font-inter">Connect with fellow students and track progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;