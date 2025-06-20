
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MessageCircle, AlertTriangle, Heart, Clock, MapPin } from 'lucide-react';

const CrisisPage = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('');

  const crisisResources = [
    {
      id: 'suicide',
      title: 'Suicide Prevention',
      titleAr: 'منع الانتحار',
      description: 'If you are having thoughts of suicide or self-harm',
      descriptionAr: 'إذا كانت لديك أفكار انتحارية أو إيذاء النفس',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      color: 'border-red-500 bg-red-50',
      contacts: [
        { name: 'International Suicide Prevention', phone: '988', available: '24/7' },
        { name: 'Crisis Text Line', phone: 'Text HOME to 741741', available: '24/7' }
      ]
    },
    {
      id: 'domestic',
      title: 'Domestic Violence',
      titleAr: 'العنف المنزلي',
      description: 'Help for domestic violence situations',
      descriptionAr: 'المساعدة في حالات العنف المنزلي',
      icon: <Heart className="h-6 w-6 text-purple-600" />,
      color: 'border-purple-500 bg-purple-50',
      contacts: [
        { name: 'National Domestic Violence Hotline', phone: '1-800-799-7233', available: '24/7' },
        { name: 'Tunisia - Ministry of Women', phone: '80101010', available: '24/7' }
      ]
    },
    {
      id: 'mental',
      title: 'Mental Health Crisis',
      titleAr: 'أزمة الصحة النفسية',
      description: 'Immediate mental health support',
      descriptionAr: 'الدعم الفوري للصحة النفسية',
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      color: 'border-blue-500 bg-blue-50',
      contacts: [
        { name: 'SAMHSA National Helpline', phone: '1-800-662-4357', available: '24/7' },
        { name: 'Tunisia - Psychological Support', phone: '71234567', available: '9 AM - 6 PM' }
      ]
    }
  ];

  const emergencySteps = [
    {
      step: 1,
      title: 'Ensure Immediate Safety',
      titleAr: 'ضمان السلامة الفورية',
      description: 'If you or someone else is in immediate danger, call emergency services',
      descriptionAr: 'إذا كنت أنت أو شخص آخر في خطر مباشر، اتصل بخدمات الطوارئ'
    },
    {
      step: 2,
      title: 'Call a Crisis Hotline',
      titleAr: 'اتصل بخط الأزمات',
      description: 'Reach out to a trained crisis counselor who can help',
      descriptionAr: 'تواصل مع مستشار أزمات مدرب يمكنه المساعدة'
    },
    {
      step: 3,
      title: 'Go to Emergency Room',
      titleAr: 'اذهب إلى غرفة الطوارئ',
      description: 'If crisis hotlines are not available, go to your nearest hospital',
      descriptionAr: 'إذا لم تكن خطوط الأزمات متاحة، اذهب إلى أقرب مستشفى'
    },
    {
      step: 4,
      title: 'Stay Connected',
      titleAr: 'ابق متصلاً',
      description: 'Keep someone you trust informed about your situation',
      descriptionAr: 'أبق شخصاً تثق به على علم بحالتك'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Navbar isLoggedIn={false} setIsLoggedIn={() => {}} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Crisis Support / دعم الأزمات
              </h1>
            </div>
            <p className="text-gray-600 mb-2">
              If you're in crisis, you're not alone. Help is available 24/7
            </p>
            <p className="text-gray-600 text-sm">
              إذا كنت في أزمة، فأنت لست وحدك. المساعدة متاحة على مدار الساعة
            </p>
            
            {/* Emergency Alert */}
            <Card className="mt-6 border-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-red-800">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-semibold">Emergency: Call 911 (US) | 197 (Tunisia)</p>
                    <p className="text-sm">طوارئ: اتصل بـ 911 (الولايات المتحدة) | 197 (تونس)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crisis Resources */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {crisisResources.map((resource) => (
              <Card 
                key={resource.id}
                className={`${resource.color} border-2 cursor-pointer transition-all hover:shadow-lg`}
                onClick={() => setSelectedType(selectedType === resource.id ? '' : resource.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {resource.icon}
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{resource.titleAr}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-2">{resource.description}</p>
                  <p className="text-sm text-gray-600 mb-4">{resource.descriptionAr}</p>
                  
                  {selectedType === resource.id && (
                    <div className="space-y-3">
                      {resource.contacts.map((contact, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{contact.name}</p>
                              <p className="text-lg font-bold text-blue-600">{contact.phone}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs">{contact.available}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-2" 
                            size="sm"
                            onClick={() => window.open(`tel:${contact.phone}`)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now / اتصل الآن
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Emergency Steps */}
          <Card className="shadow-xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                What to Do in a Crisis / ماذا تفعل في الأزمة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {emergencySteps.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.titleAr}</p>
                      <p className="text-sm text-gray-700 mb-1">{step.description}</p>
                      <p className="text-sm text-gray-600">{step.descriptionAr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tunisia Specific Resources */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Tunisia Emergency Services / خدمات الطوارئ في تونس
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-800 mb-2">Emergency Services</h3>
                    <p className="text-red-700 text-lg font-bold">197</p>
                    <p className="text-sm text-red-600">Police, Fire, Medical Emergency</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Medical Emergency</h3>
                    <p className="text-blue-700 text-lg font-bold">190</p>
                    <p className="text-sm text-blue-600">SAMU (Emergency Medical Service)</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Psychological Support</h3>
                    <h3 className="font-semibold text-green-800 mb-2">الدعم النفسي</h3>
                    <p className="text-green-700 text-lg font-bold">80101010</p>
                    <p className="text-sm text-green-600">Free psychological support hotline</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">Women's Support</h3>
                    <h3 className="font-semibold text-purple-800 mb-2">دعم المرأة</h3>
                    <p className="text-purple-700 text-lg font-bold">1899</p>
                    <p className="text-sm text-purple-600">Violence against women hotline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrisisPage;
