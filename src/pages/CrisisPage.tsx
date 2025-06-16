
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Phone, MessageCircle, MapPin, Clock, Heart, Shield, AlertTriangle, Users } from "lucide-react";

const CrisisPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "Free and confidential emotional support 24/7",
      available: "24/7",
      type: "crisis"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Crisis counseling via text message",
      available: "24/7",
      type: "text"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      available: "24/7",
      type: "info"
    },
    {
      name: "National Alliance on Mental Illness",
      number: "1-800-950-6264",
      description: "Information and support for mental health",
      available: "Mon-Fri 10am-10pm ET",
      type: "support"
    }
  ];

  const warningSignsCategories = [
    {
      title: "Immediate Danger Signs",
      signs: [
        "Talking about wanting to die or hurt oneself",
        "Looking for ways to kill oneself",
        "Talking about feeling hopeless or having no purpose",
        "Talking about feeling trapped or being in unbearable pain",
        "Talking about being a burden to others"
      ],
      severity: "high"
    },
    {
      title: "Behavioral Changes",
      signs: [
        "Increased use of alcohol or drugs",
        "Withdrawing from activities",
        "Isolating from family and friends",
        "Sleeping too much or too little",
        "Visiting or calling people to say goodbye"
      ],
      severity: "medium"
    },
    {
      title: "Mood Changes",
      signs: [
        "Depression, anxiety, loss of interest",
        "Irritability or anger",
        "Humiliation or shame",
        "Agitation or restlessness",
        "Relief or sudden improvement after being very depressed"
      ],
      severity: "medium"
    }
  ];

  const copingStrategies = [
    {
      title: "Grounding Techniques",
      strategies: [
        "5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
        "Focus on your breathing - slow, deep breaths",
        "Hold an ice cube or splash cold water on your face",
        "Listen to calming music or nature sounds"
      ]
    },
    {
      title: "Distraction Methods",
      strategies: [
        "Call a friend or family member",
        "Take a walk outside",
        "Watch a favorite movie or TV show",
        "Do a puzzle or play a game",
        "Write in a journal"
      ]
    },
    {
      title: "Self-Care Activities",
      strategies: [
        "Take a warm bath or shower",
        "Practice gentle yoga or stretching",
        "Make a cup of tea",
        "Pet an animal",
        "Look at photos that make you happy"
      ]
    }
  ];

  const professionalResources = [
    {
      title: "Psychology Today",
      description: "Find therapists, psychiatrists, and support groups in your area",
      link: "https://www.psychologytoday.com",
      type: "directory"
    },
    {
      title: "BetterHelp",
      description: "Online therapy platform with licensed professionals",
      link: "https://www.betterhelp.com",
      type: "online"
    },
    {
      title: "Talkspace",
      description: "Text-based therapy with licensed therapists",
      link: "https://www.talkspace.com",
      type: "online"
    },
    {
      title: "NAMI Support Groups",
      description: "Local support groups for individuals and families",
      link: "https://www.nami.org/Support-Education/Support-Groups",
      type: "support"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Crisis Support</h1>
            </div>
            <p className="text-gray-600 mb-4">
              If you're in crisis or having thoughts of self-harm, you're not alone. Help is available 24/7.
            </p>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">If this is an emergency, call 911 immediately</span>
              </div>
              <p className="text-red-700 text-sm">
                If you or someone you know is in immediate danger, don't wait. Call emergency services right away.
              </p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <Card className="mb-8 shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Support Lines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <Badge variant={contact.type === 'crisis' ? 'destructive' : 'secondary'}>
                        {contact.type}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{contact.number}</p>
                    <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {contact.available}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open('tel:988')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call 988 Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('sms:741741?body=HOME')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Text Crisis Line
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Warning Signs */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Warning Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {warningSignsCategories.map((category, index) => (
                  <div key={index}>
                    <h3 className={`font-semibold mb-2 ${
                      category.severity === 'high' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {category.title}
                    </h3>
                    <ul className="space-y-1">
                      {category.signs.map((sign, signIndex) => (
                        <li key={signIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            category.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                          }`}></span>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Coping Strategies */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  Coping Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {copingStrategies.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-green-700 mb-2">{category.title}</h3>
                    <ul className="space-y-1">
                      {category.strategies.map((strategy, strategyIndex) => (
                        <li key={strategyIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Professional Resources */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Professional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {professionalResources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(resource.link, '_blank')}
                    >
                      Visit Resource
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Care Reminder */}
          <div className="mt-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 text-center">
            <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You Matter</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Your life has value and meaning. It's okay to not be okay, and it's okay to ask for help. 
              Recovery is possible, and there are people who want to support you through this difficult time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisPage;
