import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Eye, EyeOff, BookOpen, Trophy, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    academicStream: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create Auth User
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name }
        }
      });

      if (authError) throw authError;

      // 2. Prevent Duplicate Account (Supabase specific check)
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account Exists",
          description: "This email is already registered. Try signing in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 3. Manually insert into profiles (The fix for your "1 entry" issue)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              full_name: formData.name,
              target_exam: formData.academicStream 
            }
          ]);

        if (profileError) throw profileError;

        toast({ title: "Success!", description: "Welcome to Prep Master!" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-primary-hover rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-outfit font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2">
              Prep Master
            </h1>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-outfit font-bold text-center">Sign Up</CardTitle>
              <CardDescription className="text-center font-inter text-base">
                Join thousands of students preparing for success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Ahmed Khan" value={formData.name} onChange={handleInputChange} required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="student@example.com" value={formData.email} onChange={handleInputChange} required className="h-11" />
                </div>

                {/* Academic Stream Selector */}
                <div className="space-y-2">
                  <Label>Academic Stream</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, academicStream: value}))} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Academic Stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-Engineering">Pre-Engineering</SelectItem>
                      <SelectItem value="Pre-Medical">Pre-Medical</SelectItem>
                      <SelectItem value="ICS">Computer Science (ICS)</SelectItem>
                      <SelectItem value="ICOM">I.COM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={handleInputChange} required className="h-11 pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleInputChange} required className="h-11" />
                </div>

                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-primary-hover shadow-md font-semibold mt-4 transition-all" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground font-inter">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Same as Login Design */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-hover p-8 text-primary-foreground">
        <div className="flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-outfit font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl text-primary-foreground/90 font-inter leading-relaxed">
              Unlock access to premium mock tests and tracked progress analytics.
            </p>
          </div>
          <div className="space-y-6">
            <Feature icon={<BookOpen />} title="Expert Content" desc="Curated materials by top educators" />
            <Feature icon={<Trophy />} title="Practice Tests" desc="Thousands of questions with explanations" />
            <Feature icon={<Users />} title="Success Community" desc="Connect with fellow students" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-primary-foreground/20 rounded-xl">{icon}</div>
    <div>
      <h3 className="font-outfit font-semibold text-lg mb-1">{title}</h3>
      <p className="text-primary-foreground/80 font-inter">{desc}</p>
    </div>
  </div>
);

export default Signup;