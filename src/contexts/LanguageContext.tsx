
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'tn';
  setLanguage: (lang: 'en' | 'tn') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'wellness.title': 'Guided Wellness & Meditation',
    'wellness.subtitle': 'Experience fully guided meditation sessions designed to help you find inner peace and tranquility',
    
    // Player controls
    'player.activeSession': 'Active Session',
    'player.selectSession': 'Select a Session',
    'player.sessionComplete': 'Session complete! 🎉',
    'player.chooseSession': 'Choose a guided meditation session',
    'player.description': 'Each session includes step-by-step guidance to help you find inner peace',
    
    // Breathing instructions
    'breathing.inhale': 'Breathe in slowly... ({count} counts)',
    'breathing.hold': 'Hold your breath gently... ({count} counts)',
    'breathing.exhale': 'Exhale completely... ({count} counts)',
    'breathing.pause': 'Natural pause...',
    'breathing.naturally': 'Breathe naturally...',
    
    // Session actions
    'action.start': 'Start Guided Session',
    'action.currentlyActive': 'Currently Active',
    'action.step': 'Step {current} of {total}',
    
    // Session titles and descriptions
    'session.breathing.title': '4-7-8 Breathing Technique',
    'session.breathing.desc': 'A powerful breathing exercise to reduce anxiety and promote relaxation',
    'session.bodyscan.title': 'Body Scan Meditation',
    'session.bodyscan.desc': 'Progressive relaxation technique to release tension throughout your body',
    'session.lovingkindness.title': 'Loving-Kindness Meditation',
    'session.lovingkindness.desc': 'Cultivate compassion and positive emotions towards yourself and others',
    'session.sleep.title': 'Deep Sleep Relaxation',
    'session.sleep.desc': 'Gentle meditation to help you unwind and prepare for restful sleep',
    'session.stress.title': 'Stress Relief Meditation',
    'session.stress.desc': 'Quick and effective meditation to reduce stress and anxiety',
    'session.mountain.title': 'Mountain Meditation',
    'session.mountain.desc': 'Advanced mindfulness practice using mountain imagery for stability',
    
    // Categories
    'category.breathing': 'breathing',
    'category.mindfulness': 'mindfulness',
    'category.relaxation': 'relaxation',
    'category.sleep': 'sleep',
    
    // Difficulty levels
    'difficulty.beginner': 'beginner',
    'difficulty.intermediate': 'intermediate',
    'difficulty.advanced': 'advanced',
    
    // Tips section
    'tips.title': 'Your Guide to Inner Peace',
    'tips.gettingStarted': 'Getting Started',
    'tips.duringPractice': 'During Practice',
    'tips.buildingPeace': 'Building Peace',
    'tips.remember': '🌟 Remember: Every moment of practice is a step toward inner peace',
    'tips.designed': 'These guided sessions are designed to help you develop lasting mindfulness and find tranquility in your daily life.',
    
    // Features
    'feature.soundGuidance': '💡 Toggle sound guidance with the volume button',
    'feature.textInstructions': '📝 Toggle text instructions with the mic button',
    'feature.visualCues': '🎯 Follow the visual cues for breathing exercises',
    'feature.guidedSteps': '✨ {count} guided steps',
    'feature.breathingPattern': ' • Breathing pattern included',
    
    // Welcome message
    'welcome.message': 'Welcome to {title}. Let\'ts begin your journey to inner peace.',
    'resume.message': 'Resuming your meditation session.',
    
    // Language selector
    'language.select': 'Language',
    'language.english': 'English',
    'language.tunisian': 'Tunisian Arabic'
  },
  tn: {
    // Header
    'wellness.title': 'التأمل والراحة النفسية',
    'wellness.subtitle': 'جلسات تأمل مُوجّهة باش تلقى السكينة والهدوء النفسي',
    
    // Player controls
    'player.activeSession': 'الجلسة النشطة',
    'player.selectSession': 'اختار جلسة',
    'player.sessionComplete': 'الجلسة كملت! 🎉',
    'player.chooseSession': 'اختار جلسة تأمل موجّهة',
    'player.description': 'كل جلسة فيها خطوات مُفصّلة باش تساعدك تلقى السكينة',
    
    // Breathing instructions
    'breathing.inhale': 'شدّ نفسك بهدوء... ({count} عدّات)',
    'breathing.hold': 'احبس نفسك بلطف... ({count} عدّات)',
    'breathing.exhale': 'اطلق نفسك بالكامل... ({count} عدّات)',
    'breathing.pause': 'وقفة طبيعية...',
    'breathing.naturally': 'تنفّس طبيعي...',
    
    // Session actions
    'action.start': 'ابدا الجلسة المُوجّهة',
    'action.currentlyActive': 'نشطة حالياً',
    'action.step': 'الخطوة {current} من {total}',
    
    // Session titles and descriptions
    'session.breathing.title': 'تقنية التنفس 4-7-8',
    'session.breathing.desc': 'تمرين تنفس قوي باش يقلّل من القلق ويهدّي الأعصاب',
    'session.bodyscan.title': 'تأمل مسح الجسم',
    'session.bodyscan.desc': 'تقنية استرخاء تدريجية باش تحرّر التوتر من جسمك',
    'session.lovingkindness.title': 'تأمل المحبة واللطف',
    'session.lovingkindness.desc': 'ينمّي الرحمة والمشاعر الإيجابية نحو روحك والآخرين',
    'session.sleep.title': 'استرخاء النوم العميق',
    'session.sleep.desc': 'تأمل لطيف باش يساعدك تسترخي وتحضّر للنوم المريح',
    'session.stress.title': 'تأمل تخفيف الضغط',
    'session.stress.desc': 'تأمل سريع وفعّال باش يقلّل من الضغط والقلق',
    'session.mountain.title': 'تأمل الجبل',
    'session.mountain.desc': 'ممارسة متقدمة في الوعي باستخدام صورة الجبل للثبات',
    
    // Categories
    'category.breathing': 'تنفس',
    'category.mindfulness': 'وعي',
    'category.relaxation': 'استرخاء',
    'category.sleep': 'نوم',
    
    // Difficulty levels
    'difficulty.beginner': 'مبتدئ',
    'difficulty.intermediate': 'متوسط',
    'difficulty.advanced': 'متقدم',
    
    // Tips section
    'tips.title': 'دليلك للسكينة الداخلية',
    'tips.gettingStarted': 'البداية',
    'tips.duringPractice': 'أثناء الممارسة',
    'tips.buildingPeace': 'بناء السكينة',
    'tips.remember': '🌟 تذكّر: كل لحظة ممارسة هي خطوة نحو السكينة الداخلية',
    'tips.designed': 'هذه الجلسات المُوجّهة مصمّمة باش تساعدك تطوّر الوعي الدائم وتلقى الهدوء في حياتك اليومية.',
    
    // Features
    'feature.soundGuidance': '💡 فعّل أو عطّل التوجيه الصوتي بالزر',
    'feature.textInstructions': '📝 فعّل أو عطّل التعليمات النصية',
    'feature.visualCues': '🎯 اتبع الإشارات البصرية لتمارين التنفس',
    'feature.guidedSteps': '✨ {count} خطوة موجّهة',
    'feature.breathingPattern': ' • نمط التنفس مُدرج',
    
    // Welcome message
    'welcome.message': 'أهلاً بيك في {title}. يلا نبداو رحلتك نحو السكينة الداخلية.',
    'resume.message': 'استكمال جلسة التأمل.',
    
    // Language selector
    'language.select': 'اللغة',
    'language.english': 'English',
    'language.tunisian': 'العربية التونسية'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'tn'>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
