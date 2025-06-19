
import { pipeline } from '@huggingface/transformers';

interface TherapySession {
  userMessage: string;
  therapistResponse: string;
  timestamp: Date;
  emotions: string[];
  techniques: string[];
}

class MentalHealthAI {
  private textGenerator: any = null;
  private isLoading = false;
  private sessionHistory: TherapySession[] = [];

  async initialize() {
    if (this.textGenerator || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Initializing specialized mental health AI...');
    
    try {
      // Using a more advanced model for better therapeutic responses
      this.textGenerator = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-medium',
        { device: 'webgpu' }
      );
      console.log('Mental health AI model loaded successfully');
    } catch (error) {
      console.error('Error loading mental health AI model:', error);
      try {
        this.textGenerator = await pipeline(
          'text-generation',
          'microsoft/DialoGPT-medium',
          { device: 'cpu' }
        );
        console.log('Mental health AI model loaded on CPU');
      } catch (cpuError) {
        console.error('Failed to load mental health AI model on CPU:', cpuError);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async generateTherapyResponse(userMessage: string, therapyType: string, conversationHistory: string[] = []): Promise<string> {
    // Analyze user's emotional state
    const emotions = this.analyzeEmotions(userMessage);
    const techniques = this.selectTherapyTechniques(userMessage, therapyType, emotions);
    
    let response = '';
    
    if (this.textGenerator) {
      try {
        const therapeuticPrompt = this.buildTherapeuticPrompt(userMessage, therapyType, conversationHistory, emotions, techniques);
        
        const result = await this.textGenerator(therapeuticPrompt, {
          max_new_tokens: 100,
          temperature: 0.8,
          do_sample: true,
          repetition_penalty: 1.2,
          pad_token_id: 0,
        });

        response = this.cleanTherapeuticResponse(result, therapeuticPrompt);
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }
    
    // Fallback to specialized therapeutic responses
    if (!response || response.length < 30) {
      response = this.generateSpecializedResponse(userMessage, therapyType, emotions, techniques);
    }

    // Store session data
    this.sessionHistory.push({
      userMessage,
      therapistResponse: response,
      timestamp: new Date(),
      emotions,
      techniques
    });

    return response;
  }

  private analyzeEmotions(message: string): string[] {
    const emotionKeywords = {
      anxiety: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'frightened', 'overwhelmed'],
      depression: ['sad', 'depressed', 'hopeless', 'empty', 'worthless', 'numb', 'tired'],
      anger: ['angry', 'furious', 'rage', 'mad', 'frustrated', 'irritated', 'hate'],
      grief: ['loss', 'died', 'death', 'miss', 'gone', 'funeral', 'mourning'],
      stress: ['stressed', 'pressure', 'burnout', 'exhausted', 'overworked'],
      loneliness: ['lonely', 'alone', 'isolated', 'disconnected', 'withdrawn'],
      fear: ['afraid', 'terrified', 'phobia', 'terror', 'dread'],
      shame: ['ashamed', 'embarrassed', 'guilty', 'humiliated', 'disgrace'],
      confusion: ['confused', 'lost', 'uncertain', 'unclear', 'mixed up']
    };

    const detectedEmotions: string[] = [];
    const messageLower = message.toLowerCase();

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    }

    return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
  }

  private selectTherapyTechniques(message: string, therapyType: string, emotions: string[]): string[] {
    const techniques: string[] = [];

    // CBT techniques
    if (therapyType === 'cbt' || emotions.includes('anxiety') || emotions.includes('depression')) {
      techniques.push('thought_challenging', 'cognitive_restructuring', 'behavioral_activation');
    }

    // DBT techniques
    if (therapyType === 'dbt' || emotions.includes('anger') || emotions.includes('overwhelmed')) {
      techniques.push('mindfulness', 'distress_tolerance', 'emotion_regulation');
    }

    // Trauma-informed techniques
    if (message.toLowerCase().includes('trauma') || emotions.includes('fear')) {
      techniques.push('grounding', 'safety_planning', 'trauma_processing');
    }

    // General therapeutic techniques
    techniques.push('active_listening', 'empathetic_responding', 'open_ended_questions');

    return techniques;
  }

  private buildTherapeuticPrompt(message: string, therapyType: string, history: string[], emotions: string[], techniques: string[]): string {
    const context = history.slice(-2).join('\n');
    const emotionContext = emotions.length > 0 ? `The client appears to be experiencing: ${emotions.join(', ')}. ` : '';
    
    return `You are a licensed therapist specializing in ${therapyType} therapy. ${emotionContext}Respond with empathy, professionalism, and therapeutic insight.

${context ? `Recent conversation:\n${context}\n` : ''}
Client: ${message}

Therapist:`;
  }

  private cleanTherapeuticResponse(response: any, prompt: string): string {
    let cleaned = '';
    
    if (Array.isArray(response)) {
      cleaned = response[0]?.generated_text || '';
    } else {
      cleaned = response.generated_text || '';
    }

    cleaned = cleaned.replace(prompt, '').trim();
    cleaned = cleaned.replace(/^(Therapist:|Client:|Response:)/i, '').trim();
    cleaned = cleaned.split('\n')[0];
    
    if (cleaned && !cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }

    return cleaned;
  }

  private generateSpecializedResponse(message: string, therapyType: string, emotions: string[], techniques: string[]): string {
    const messageLower = message.toLowerCase();

    // Crisis intervention responses
    if (this.isCrisisMessage(messageLower)) {
      return this.getCrisisResponse();
    }

    // Emotion-specific therapeutic responses
    if (emotions.includes('anxiety')) {
      return this.getAnxietyResponse(messageLower);
    }

    if (emotions.includes('depression')) {
      return this.getDepressionResponse(messageLower);
    }

    if (emotions.includes('anger')) {
      return this.getAngerResponse(messageLower);
    }

    if (emotions.includes('grief')) {
      return this.getGriefResponse(messageLower);
    }

    // Therapy-type specific responses
    if (therapyType === 'cbt') {
      return this.getCBTResponse(messageLower);
    }

    if (therapyType === 'dbt') {
      return this.getDBTResponse(messageLower);
    }

    // Default therapeutic response
    return this.getGeneralTherapeuticResponse(messageLower);
  }

  private isCrisisMessage(message: string): boolean {
    const crisisKeywords = ['kill myself', 'suicide', 'end it all', 'hurt myself', 'self harm', 'not worth living'];
    return crisisKeywords.some(keyword => message.includes(keyword));
  }

  private getCrisisResponse(): string {
    return "I'm very concerned about what you're sharing with me. Your safety is the most important thing right now. If you're having thoughts of hurting yourself, please reach out to a crisis hotline immediately: 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. I'm here to support you, but professional crisis intervention may be needed right now.";
  }

  private getAnxietyResponse(message: string): string {
    const responses = [
      "Anxiety can feel overwhelming, like your mind is racing with worst-case scenarios. Let's take a moment to ground ourselves. Can you tell me five things you can see around you right now? This can help bring you back to the present moment.",
      "I can hear the anxiety in what you're sharing. Your nervous system is in high alert mode right now. What does the anxiety feel like in your body? Is it tightness in your chest, butterflies in your stomach, or something else?",
      "Anxiety often tries to convince us that we're in immediate danger, even when we're safe. What thoughts are contributing most to this anxious feeling? Let's examine them together."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getDepressionResponse(message: string): string {
    const responses = [
      "Depression can make everything feel heavy and colorless. It takes courage to reach out when you're feeling this way. What's been the hardest part of your day today? Sometimes talking about the small struggles can help us understand the bigger picture.",
      "That feeling of emptiness or numbness - it's like being disconnected from yourself and the world around you. You're not alone in this feeling, even though depression can make it seem that way. What used to bring you joy that feels difficult to access right now?",
      "Depression lies to us about our worth and our future. When you're feeling worthless, what does that voice sound like? Is it familiar - perhaps echoing something someone once said to you, or how you learned to speak to yourself?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAngerResponse(message: string): string {
    const responses = [
      "Anger is often pain or hurt wearing a protective mask. It can feel safer to be angry than vulnerable. What might be underneath that rage you're feeling? What's the hurt or fear that the anger might be protecting?",
      "When anger feels explosive like this, it's usually because there's been a lot building up for a long time. What first lit that fuse? Sometimes understanding the deeper triggers can help us find better ways to express these intense feelings.",
      "Your anger is telling us something important about your boundaries, your values, or your needs. What is it trying to protect or defend? Let's listen to what it's really trying to communicate."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGriefResponse(message: string): string {
    const responses = [
      "Grief is love with nowhere to go. It's one of the most profound human experiences because it reflects how deeply we can connect with others. What do you miss most about them, beyond just their physical presence?",
      "Loss changes everything - it's like learning to live in a world that suddenly operates by different rules. There's no timeline for grief, despite what others might tell you. How has your grief been showing up for you lately?",
      "The pain of loss can feel unbearable because it represents the depth of your love and connection. Grief isn't something we 'get over' - it's something we learn to carry. How are you being gentle with yourself through this process?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getCBTResponse(message: string): string {
    const responses = [
      "Let's pause and examine the thoughts that were running through your mind in that moment. What was the first automatic thought that popped up? Often our emotional reactions are driven by these quick, unconscious thoughts.",
      "I'm noticing a thinking pattern here that might be worth exploring. What evidence do you have that supports this thought? And what evidence might challenge it? Sometimes our minds jump to conclusions without all the facts.",
      "That sounds like what we call a 'cognitive distortion' - when our minds play tricks on us and make situations seem worse than they are. If your best friend came to you with this exact same thought, what would you tell them?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getDBTResponse(message: string): string {
    const responses = [
      "Let's practice some mindfulness right now. Can you take a deep breath with me and notice what you're feeling in your body at this moment? What sensations do you notice - tension, warmth, heaviness?",
      "This sounds like a moment where our distress tolerance skills could really help. When emotions feel this intense, what techniques have you tried before? Sometimes we need to ride the wave rather than fight it.",
      "I can hear the intensity of emotion in what you're sharing. Let's practice holding space for this feeling without trying to fix it or make it go away immediately. What would it look like to be compassionate with yourself right now?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGeneralTherapeuticResponse(message: string): string {
    const responses = [
      "Thank you for trusting me with something so personal. What you're sharing takes real courage. What feels most important for you to focus on right now as we talk through this together?",
      "I can hear how much this situation is weighing on you. Sometimes when we're in the middle of something difficult, it's hard to see all the pieces clearly. What would it mean for you if this situation started to feel different?",
      "There's so much complexity in what you're describing. You're carrying a lot right now. What kind of support would feel most helpful to you in this moment? What do you need most from our conversation today?",
      "What strikes me is how much strength it takes to be here, talking about these difficult things. That's not always easy to recognize when we're struggling, but it's important. How are you taking care of yourself through all of this?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getSessionAnalytics() {
    return {
      totalSessions: this.sessionHistory.length,
      commonEmotions: this.getCommonEmotions(),
      progressTrend: this.getProgressTrend(),
      lastSessionDate: this.sessionHistory.length > 0 ? this.sessionHistory[this.sessionHistory.length - 1].timestamp : null
    };
  }

  private getCommonEmotions(): { emotion: string; count: number }[] {
    const emotionCounts: { [key: string]: number } = {};
    
    this.sessionHistory.forEach(session => {
      session.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getProgressTrend(): string {
    if (this.sessionHistory.length < 2) return 'neutral';
    
    const recent = this.sessionHistory.slice(-5);
    const negativeEmotions = ['anxiety', 'depression', 'anger', 'grief', 'stress'];
    
    let positiveCount = 0;
    recent.forEach(session => {
      const hasNegative = session.emotions.some(emotion => negativeEmotions.includes(emotion));
      if (!hasNegative || session.emotions.includes('neutral')) {
        positiveCount++;
      }
    });

    if (positiveCount > recent.length * 0.6) return 'improving';
    if (positiveCount < recent.length * 0.4) return 'needs_attention';
    return 'stable';
  }

  isModelReady(): boolean {
    return !!this.textGenerator && !this.isLoading;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const mentalHealthAI = new MentalHealthAI();
