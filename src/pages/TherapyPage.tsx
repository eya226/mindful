
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChatInterface } from "@/components/ChatInterface";
import { useAuth } from "@/hooks/useAuth";

const TherapyPage = () => {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar 
          isLoggedIn={!!user} 
          setIsLoggedIn={() => signOut()} 
        />
        
        <div className="pt-20 pb-8 px-4">
          <ChatInterface />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TherapyPage;
