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
      // Using the specialized mental health chatbot model
      this.textGenerator = await pipeline(
        'text-generation',
        'thrishala/mental_health_chatbot',
        { device: 'webgpu' }
      );
      console.log('Mental health chatbot model loaded successfully');
    } catch (error) {
      console.error('Error loading mental health model:', error);
      try {
        // Fallback to CPU if WebGPU fails
        this.textGenerator = await pipeline(
          'text-generation',
          'thrishala/mental_health_chatbot',
          { device: 'cpu' }
        );
        console.log('Mental health chatbot model loaded on CPU');
      } catch (cpuError) {
        console.error('Failed to load mental health model:', cpuError);
        // Final fallback to a general model
        try {
          this.textGenerator = await pipeline(
            'text-generation',
            'microsoft/DialoGPT-medium',
            { device: 'cpu' }
          );
          console.log('Fallback conversational model loaded');
        } catch (fallbackError) {
          console.error('All models failed to load:', fallbackError);
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  async generateTherapyResponse(userMessage: string, therapyType: string, conversationHistory: string[] = []): Promise<string> {
    // Check for simple greetings first
    if (this.isSimpleGreeting(userMessage)) {
      return this.getGreetingResponse(userMessage);
    }

    // Check for casual/small talk
    if (this.isCasualConversation(userMessage)) {
      return this.getCasualResponse(userMessage);
    }

    const emotions = this.analyzeEmotions(userMessage);
    const techniques = this.selectTherapyTechniques(userMessage, therapyType, emotions);
    
    let response = '';
    
    if (this.textGenerator) {
      try {
        const therapeuticPrompt = this.buildTherapeuticPrompt(userMessage, therapyType, conversationHistory, emotions);
        
        const result = await this.textGenerator(therapeuticPrompt, {
          max_new_tokens: 120,
          temperature: 0.8,
          do_sample: true,
          repetition_penalty: 1.2,
          top_p: 0.9,
          top_k: 40,
          pad_token_id: 50256,
        });

        response = this.cleanResponse(result, therapeuticPrompt);
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }
    
    // Enhanced fallback responses for better therapeutic quality
    if (!response || response.length < 30) {
      response = this.generateAdvancedTherapeuticResponse(userMessage, therapyType, emotions, techniques);
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

  private isSimpleGreeting(message: string): boolean {
    const greetings = [
      'hi', 'hello', 'hey', 'hiya', 'howdy', 'greetings', 'good morning', 
      'good afternoon', 'good evening', 'good day', 'sup', 'what\'s up', 
      'yo', 'hej', 'bonjour', 'hola'
    ];
    
    const messageLower = message.toLowerCase().trim();
    
    // Check if the message is just a greeting (with optional punctuation)
    const cleanMessage = messageLower.replace(/[.,!?]/g, '');
    
    return greetings.some(greeting => 
      cleanMessage === greeting || 
      cleanMessage === `${greeting} there` ||
      cleanMessage === `${greeting} doc` ||
      cleanMessage === `${greeting} doctor`
    ) && message.length < 25; // Keep it short to avoid false positives
  }

  private isCasualConversation(message: string): boolean {
    const casualPhrases = [
      'how are you', 'how\'s it going', 'what\'s going on', 'how do you do',
      'nice to meet you', 'pleased to meet you', 'good to see you',
      'how\'s your day', 'how\'s everything', 'what\'s new', 'how are things',
      'thanks', 'thank you', 'bye', 'goodbye', 'see you', 'take care',
      'have a good day', 'nice talking', 'chat later'
    ];
    
    const messageLower = message.toLowerCase().trim();
    
    return casualPhrases.some(phrase => 
      messageLower.includes(phrase)
    ) && message.length < 50; // Keep it reasonably short
  }

  private getGreetingResponse(message: string): string {
    const responses = [
      "Hello! I'm glad you're here. How are you feeling today?",
      "Hi there! Welcome. What would you like to talk about?",
      "Hello! It's good to see you. How can I support you today?",
      "Hi! I'm here to listen. What's on your mind?",
      "Hello! Thanks for reaching out. How are you doing?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getCasualResponse(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('how are you')) {
      return "I'm doing well, thank you for asking! I'm here and ready to listen. How are you feeling today?";
    }
    
    if (messageLower.includes('thank')) {
      return "You're very welcome! I'm glad I could help. Is there anything else you'd like to talk about?";
    }
    
    if (messageLower.includes('bye') || messageLower.includes('goodbye')) {
      return "Take care! Remember, I'm here whenever you need someone to talk to. Have a good day!";
    }
    
    // Default casual response
    return "I'm here and listening. What would you like to share with me today?";
  }

  private buildTherapeuticPrompt(message: string, therapyType: string, history: string[], emotions: string[]): string {
    const context = history.slice(-2).join('\n');
    const emotionContext = emotions.length > 0 ? `Client emotions: ${emotions.join(', ')}. ` : '';
    
    return `You are a compassionate mental health counselor. ${emotionContext}Provide supportive, empathetic responses that validate feelings and offer gentle guidance.

${context ? `Previous conversation:\n${context}\n` : ''}
Client: ${message}
Counselor:`;
  }

  private cleanResponse(response: any, prompt: string): string {
    let cleaned = '';
    
    if (Array.isArray(response)) {
      cleaned = response[0]?.generated_text || '';
    } else {
      cleaned = response.generated_text || '';
    }

    // Remove the prompt from the response
    cleaned = cleaned.replace(prompt, '').trim();
    
    // Clean up common artifacts
    cleaned = cleaned.replace(/^(Counselor:|Therapist:|Client:)/i, '').trim();
    
    // Take only the first complete response
    const sentences = cleaned.split(/[.!?]+/);
    if (sentences.length > 1) {
      cleaned = sentences.slice(0, 2).join('. ').trim();
      if (cleaned && !cleaned.match(/[.!?]$/)) {
        cleaned += '.';
      }
    }

    // Remove any trailing incomplete text
    cleaned = cleaned.replace(/\n.*$/s, '').trim();
    
    return cleaned;
  }

  private analyzeEmotions(message: string): string[] {
    const emotionKeywords = {
      anxiety: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'frightened', 'overwhelmed', 'stress', 'tense'],
      depression: ['sad', 'depressed', 'hopeless', 'empty', 'worthless', 'numb', 'tired', 'down', 'low'],
      anger: ['angry', 'furious', 'rage', 'mad', 'frustrated', 'irritated', 'hate', 'annoyed'],
      grief: ['loss', 'died', 'death', 'miss', 'gone', 'funeral', 'mourning', 'grief'],
      stress: ['stressed', 'pressure', 'burnout', 'exhausted', 'overworked', 'busy'],
      loneliness: ['lonely', 'alone', 'isolated', 'disconnected', 'withdrawn', 'social'],
      fear: ['afraid', 'terrified', 'phobia', 'terror', 'dread', 'scary'],
      shame: ['ashamed', 'embarrassed', 'guilty', 'humiliated', 'disgrace', 'regret'],
      confusion: ['confused', 'lost', 'uncertain', 'unclear', 'mixed up', 'don\'t know'],
      happiness: ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing'],
      hope: ['hope', 'optimistic', 'positive', 'better', 'improve', 'progress']
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

    if (therapyType === 'cbt' || emotions.includes('anxiety') || emotions.includes('depression')) {
      techniques.push('thought_challenging', 'cognitive_restructuring', 'behavioral_activation');
    }

    if (therapyType === 'dbt' || emotions.includes('anger') || emotions.includes('overwhelmed')) {
      techniques.push('mindfulness', 'distress_tolerance', 'emotion_regulation');
    }

    if (message.toLowerCase().includes('trauma') || emotions.includes('fear')) {
      techniques.push('grounding', 'safety_planning', 'trauma_processing');
    }

    techniques.push('active_listening', 'empathetic_responding', 'motivational_interviewing');

    return techniques;
  }

  private generateAdvancedTherapeuticResponse(message: string, therapyType: string, emotions: string[], techniques: string[]): string {
    const messageLower = message.toLowerCase();

    // Crisis intervention - highest priority
    if (this.isCrisisMessage(messageLower)) {
      return "I'm really concerned about what you're sharing with me. Your safety is my top priority. If you're having thoughts of hurting yourself, please reach out immediately - call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. You matter, and there are people who want to help you through this difficult time.";
    }

    // Emotion-specific responses with more humanity
    if (emotions.includes('anxiety')) {
      return this.getAdvancedAnxietyResponse(messageLower);
    }

    if (emotions.includes('depression')) {
      return this.getAdvancedDepressionResponse(messageLower);
    }

    if (emotions.includes('anger')) {
      return this.getAdvancedAngerResponse(messageLower);
    }

    if (emotions.includes('grief')) {
      return this.getAdvancedGriefResponse(messageLower);
    }

    if (emotions.includes('loneliness')) {
      return this.getAdvancedLonelinessResponse(messageLower);
    }

    // Default therapeutic response
    return this.getAdvancedGeneralResponse(messageLower);
  }

  private isCrisisMessage(message: string): boolean {
    const crisisKeywords = ['kill myself', 'suicide', 'end it all', 'hurt myself', 'self harm', 'not worth living', 'want to die'];
    return crisisKeywords.some(keyword => message.includes(keyword));
  }

  private getAdvancedAnxietyResponse(message: string): string {
    const responses = [
      "I can really hear the anxiety in your words, and that feeling of being overwhelmed is so valid. Anxiety has this way of making our minds race with 'what ifs' that feel incredibly real in the moment. Let's take this one step at a time. Can you tell me what this anxiety feels like in your body right now?",
      "That anxious feeling you're describing sounds really intense. When anxiety hits like this, it can feel like your mind is trying to prepare for every possible threat. What's the very first thing you notice when these anxious thoughts start to spiral?",
      "I hear how much this anxiety is affecting you. It takes real courage to reach out when you're feeling this overwhelmed. What would it look like if we could turn down the volume on that anxious voice for just a moment?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdvancedDepressionResponse(message: string): string {
    const responses = [
      "What you're describing sounds incredibly heavy, and I want you to know that it takes real strength to reach out when you're feeling this way. Depression has this cruel way of convincing us we're alone, but you're here talking to me. What's one small thing that used to bring you even a tiny bit of comfort?",
      "That emptiness you're feeling - it's like being wrapped in fog where everything feels muted and distant. Depression can make it so hard to remember who you were before this feeling took over. You mentioned feeling worthless - that's the depression talking, not the truth about who you are.",
      "I can hear how exhausted you are, not just physically but emotionally too. When depression settles in like this, even small tasks can feel overwhelming. What would it look like to treat yourself with the same compassion you'd show a good friend going through this?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdvancedAngerResponse(message: string): string {
    const responses = [
      "I can feel the intensity of your anger, and it sounds like it's been building up for a while. Anger often tries to tell us something important - maybe that a boundary has been crossed or something you value has been threatened. What do you think your anger is trying to protect right now?",
      "That rage you're feeling sounds consuming. Sometimes anger is our way of avoiding other feelings that might feel too vulnerable. If we could sit with this anger for a moment without judgment, what other emotions might be underneath it?",
      "It sounds like this anger has become overwhelming. When we're this angry, our whole body goes into fight mode. What does this anger feel like in your body? And what do you need right now to feel safe with these feelings?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdvancedGriefResponse(message: string): string {
    const responses = [
      "Grief is love with nowhere to go. The pain you're feeling reflects how deeply you cared. There's no timeline for grief, despite what people might tell you. How has your grief been showing up for you lately?",
      "Loss changes everything, doesn't it? It's like the world operates by different rules while everyone else seems to move forward and you're stuck in this place of pain. What do you miss most beyond just their physical presence?",
      "The pain of grief represents the depth of your connection. People often want to rush us through grief, but it's not something we 'get over' - it's something we learn to carry. How are you being gentle with yourself through this?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdvancedLonelinessResponse(message: string): string {
    const responses = [
      "Loneliness can be one of the most painful human experiences because we're wired for connection. Even when surrounded by people, you can still feel incredibly alone. What does loneliness feel like for you - is it an empty feeling, or more like being behind glass?",
      "That feeling of isolation - like being on an island while everyone else lives on the mainland, connected and engaged. Sometimes loneliness comes from not feeling truly seen or understood. When was the last time you felt genuinely connected to someone?",
      "Loneliness has this way of convincing us we're the only ones feeling this way, but you're definitely not alone in feeling alone. Sometimes we disconnect as a way to protect ourselves from further hurt. What makes connection feel safe or unsafe for you?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdvancedGeneralResponse(message: string): string {
    const responses = [
      "Thank you for sharing something so personal with me. I can hear how much thought you've put into this. What strikes me most is your willingness to be vulnerable here. What feels most important for you to explore right now?",
      "What you're describing resonates with so much of the human experience - that struggle to make sense of our feelings and find our way forward. If you could step back and look at this with compassion, as if talking to a dear friend, what would you want them to know?",
      "I'm struck by the complexity of what you're sharing. There's so much happening beneath the surface. Sometimes our struggles are actually signs of growth trying to happen. What would it look like to be patient with yourself as you work through this?",
      "The fact that you're here, talking about these difficult things, tells me something important about your strength. What kind of support feels most helpful to you right now? What do you need most from our conversation today?"
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
