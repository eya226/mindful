
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, BookOpen, Activity, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Therapy",
      description: "Start a personalized therapy session",
      icon: <Brain className="h-6 w-6" />,
      path: "/therapy",
      color: "bg-blue-500"
    },
    {
      title: "Journal",
      description: "Write and reflect on your thoughts",
      icon: <BookOpen className="h-6 w-6" />,
      path: "/journal",
      color: "bg-green-500"
    },
    {
      title: "Wellness",
      description: "Meditation and mindfulness exercises",
      icon: <Heart className="h-6 w-6" />,
      path: "/wellness",
      color: "bg-purple-500"
    },
    {
      title: "Progress",
      description: "Track your mental health journey",
      icon: <Activity className="h-6 w-6" />,
      path: "/progress",
      color: "bg-orange-500"
    },
    {
      title: "Crisis Support",
      description: "Immediate help when you need it",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/crisis",
      color: "bg-red-500"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar 
          isLoggedIn={!!user} 
          setIsLoggedIn={() => signOut()} 
        />
        
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.user_metadata?.full_name || 'there'}!
              </h1>
              <p className="text-gray-600">
                How can I support your mental health journey today?
              </p>
            </div>

            <UserProfile />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(feature.path)}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
