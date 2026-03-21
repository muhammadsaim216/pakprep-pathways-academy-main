import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StreamSelector from "@/components/StreamSelector";
import TestSelector from "@/components/TestSelector";
import UniversitySelector from "@/components/UniversitySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";
import { supabase } from "@/lib/supabase"; // Ensure this import exists

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    setStep(1);
  };

  const handleTestSelect = (test: string) => {
    setSelectedTest(test);
    setStep(2);
  };

  const handleUniversitySelect = async (university: string) => {
    setSelectedUniversity(university);

    try {
      // 1. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Save selections to Supabase profiles table
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            target_stream: selectedStream,
            target_test: selectedTest,
            target_university: university,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving user selection:", error);
      // Optional: Add a toast notification here if saving fails
    }

    // 3. Navigate to Dashboard
    // The Dashboard will now fetch this fresh data from the DB via useEffect
    navigate("/dashboard");
  };

  const resetToStream = () => setStep(0);
  const backToTest = () => setStep(1);

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Success Rate", value: "85%", icon: TrendingUp },
    { label: "Universities Covered", value: "50+", icon: Award },
  ];

  if (step > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          {step === 1 && (
            <TestSelector 
              stream={selectedStream}
              onTestSelect={handleTestSelect}
              onBack={resetToStream}
            />
          )}
          {step === 2 && (
            <UniversitySelector 
              stream={selectedStream}
              test={selectedTest}
              onUniversitySelect={handleUniversitySelect}
              onBack={backToTest}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-primary rounded-xl">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-outfit font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Prep Master
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground font-inter mb-8 leading-relaxed">
              Your comprehensive platform for Pakistani entrance test preparation. 
              <br />
              Excel in MDCAT, ECAT, NET and secure admission to top universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="hero" 
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => setStep(0)}
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 font-inter"
              >
                View Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="border-0 bg-primary-light/30 hover:bg-primary-light/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-outfit font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-inter">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-4">
              Our Courses
            </h2>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              Choose from our comprehensive test preparation courses designed for Pakistani entrance exams
            </p>
          </div>
          <StreamSelector onStreamSelect={handleStreamSelect} />
        </div>
      </section>

      {/* Practice Tests Section */}
      <section id="practice-tests" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-4">
              Practice Tests
            </h2>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              Test your knowledge with our extensive collection of practice tests and mock exams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-outfit font-semibold mb-3">MDCAT Practice</h3>
                <p className="text-muted-foreground font-inter">
                  Comprehensive medical entrance test preparation with 500+ questions
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-outfit font-semibold mb-3">ECAT Mock Tests</h3>
                <p className="text-muted-foreground font-inter">
                  ECAT Mock exams with detailed performance analytics
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-outfit font-semibold mb-3">NET Preparation</h3>
                <p className="text-muted-foreground font-inter">
                  NUST Entry Test prep with university-specific modules
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-6">
              About Prep Master
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 leading-relaxed">
              Prep Master is Pakistan's leading online platform for entrance test preparation. 
              We've helped thousands of students achieve their dreams of getting into top universities...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-outfit font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground font-inter">
                    To democratize quality education...
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-outfit font-semibold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground font-inter">
                    To become the most trusted and effective platform...
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8">
              Join thousands of successful students and begin your path to academic excellence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => navigate('/signup')}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 font-inter"
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-xl font-outfit font-bold">Prep Master</span>
          </div>
          <p className="text-primary-foreground/80 font-inter">
            © 2026 Prep Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;