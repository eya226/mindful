
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
      name: "Ligne Verte - Urgences Nationales",
      number: "80 101 997",
      description: "Service d'urgence national tunisien disponible 24h/24",
      available: "24/7",
      type: "crisis"
    },
    {
      name: "Police d'Urgence",
      number: "197",
      description: "Police d'urgence pour situations critiques",
      available: "24/7",
      type: "emergency"
    },
    {
      name: "SAMU - Urgences Médicales",
      number: "190",
      description: "Service d'aide médicale urgente",
      available: "24/7",
      type: "medical"
    },
    {
      name: "Protection Civile",
      number: "198",
      description: "Services de protection civile et secours",
      available: "24/7",
      type: "emergency"
    },
    {
      name: "SOS Amitié Tunisie",
      number: "70 007 000",
      description: "Ligne d'écoute pour détresse psychologique",
      available: "Tous les jours 18h-24h",
      type: "support"
    },
    {
      name: "Centre National de Prévention du Suicide",
      number: "71 348 856",
      description: "Aide et prévention du suicide",
      available: "Lun-Ven 8h-17h",
      type: "crisis"
    }
  ];

  const warningSignsCategories = [
    {
      title: "Signes de Danger Immédiat",
      signs: [
        "Parler de vouloir mourir ou se faire du mal",
        "Chercher des moyens de se suicider",
        "Parler de se sentir sans espoir ou sans but",
        "Parler de se sentir piégé ou dans une douleur insupportable",
        "Parler d'être un fardeau pour les autres"
      ],
      severity: "high"
    },
    {
      title: "Changements Comportementaux",
      signs: [
        "Augmentation de l'usage d'alcool ou de drogues",
        "Se retirer des activités",
        "S'isoler de la famille et des amis",
        "Dormir trop ou trop peu",
        "Visiter ou appeler les gens pour dire au revoir"
      ],
      severity: "medium"
    },
    {
      title: "Changements d'Humeur",
      signs: [
        "Dépression, anxiété, perte d'intérêt",
        "Irritabilité ou colère",
        "Humiliation ou honte",
        "Agitation ou agitation",
        "Soulagement ou amélioration soudaine après avoir été très déprimé"
      ],
      severity: "medium"
    }
  ];

  const copingStrategies = [
    {
      title: "Techniques d'Ancrage",
      strategies: [
        "Technique 5-4-3-2-1: Nommez 5 choses que vous voyez, 4 que vous pouvez toucher, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez",
        "Concentrez-vous sur votre respiration - respirations lentes et profondes",
        "Tenez un glaçon ou aspergez d'eau froide sur votre visage",
        "Écoutez de la musique apaisante ou des sons de la nature"
      ]
    },
    {
      title: "Méthodes de Distraction",
      strategies: [
        "Appelez un ami ou un membre de la famille",
        "Promenez-vous dehors",
        "Regardez un film ou une émission préférée",
        "Faites un puzzle ou jouez à un jeu",
        "Écrivez dans un journal"
      ]
    },
    {
      title: "Activités de Soins Personnels",
      strategies: [
        "Prenez un bain ou une douche chaude",
        "Pratiquez le yoga doux ou les étirements",
        "Préparez une tasse de thé",
        "Caressez un animal",
        "Regardez des photos qui vous rendent heureux"
      ]
    }
  ];

  const professionalResources = [
    {
      title: "Ordre des Psychologues de Tunisie",
      description: "Trouvez des psychologues agréés en Tunisie",
      link: "http://www.psychologues.tn",
      type: "directory"
    },
    {
      title: "Association Tunisienne de Psychiatrie",
      description: "Ressources et psychiatres en Tunisie",
      link: "https://atpsy.tn",
      type: "directory"
    },
    {
      title: "Centres de Santé Mentale - Tunis",
      description: "Services de santé mentale publics à Tunis",
      link: "#",
      type: "public"
    },
    {
      title: "ATPEF - Association Tunisienne de Prévention",
      description: "Prévention et éducation en santé mentale",
      link: "#",
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
              <h1 className="text-3xl font-bold text-gray-900">Soutien en Crise</h1>
            </div>
            <p className="text-gray-600 mb-4">
              Si vous êtes en crise ou avez des pensées d'automutilation, vous n'êtes pas seul. L'aide est disponible 24h/24.
            </p>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">En cas d'urgence, appelez le 197 immédiatement</span>
              </div>
              <p className="text-red-700 text-sm">
                Si vous ou quelqu'un que vous connaissez êtes en danger immédiat, n'attendez pas. Appelez les services d'urgence maintenant.
              </p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <Card className="mb-8 shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Lignes de Soutien d'Urgence - Tunisie
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
                  onClick={() => window.open('tel:197')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler 197 Maintenant
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('tel:70007000')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  SOS Amitié
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
                  Signes d'Alerte
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
                  Stratégies d'Adaptation
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
                Ressources Professionnelles en Tunisie
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
                      onClick={() => resource.link !== '#' && window.open(resource.link, '_blank')}
                      disabled={resource.link === '#'}
                    >
                      {resource.link === '#' ? 'Bientôt Disponible' : 'Visiter la Ressource'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Care Reminder */}
          <div className="mt-8 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 text-center">
            <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous Comptez</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Votre vie a de la valeur et du sens. Il est normal de ne pas aller bien, et il est normal de demander de l'aide. 
              La guérison est possible, et il y a des gens qui veulent vous soutenir pendant cette période difficile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisPage;
