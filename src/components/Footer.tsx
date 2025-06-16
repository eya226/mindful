
import { Brain, Heart, Shield, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MindfulAI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted AI companion for mental health and wellness support.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/therapy" className="hover:text-white transition-colors">AI Therapy</a></li>
              <li><a href="/journal" className="hover:text-white transition-colors">Smart Journaling</a></li>
              <li><a href="/wellness" className="hover:text-white transition-colors">Meditation</a></li>
              <li><a href="/progress" className="hover:text-white transition-colors">Progress Tracking</a></li>
              <li><a href="/crisis" className="hover:text-white transition-colors">Crisis Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get Help</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>Crisis Hotline: 988</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@mindfulai.com</span>
              </div>
              <div className="pt-2">
                <Button className="bg-red-600 hover:bg-red-700 w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Emergency Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 MindfulAI. All rights reserved. This platform is not a replacement for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
};
