
import { pipeline } from '@huggingface/transformers';

class AITherapyService {
  private textGenerator: any = null;
  private isLoading = false;

  async initialize() {
    if (this.textGenerator || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Initializing AI therapy model...');
    
    try {
      // Use a better conversational model for therapy
      this.textGenerator = await pipeline(
        'text-generation',
        'Xenova/LaMini-Flan-T5-248M',
        { 
          device: 'webgpu'
        }
      );
      console.log('AI therapy model loaded successfully');
    } catch (error) {
      console.error('Error loading AI model:', error);
      // Fallback to CPU if WebGPU fails
      try {
        this.textGenerator = await pipeline(
          'text-generation',
          'Xenova/LaMini-Flan-T5-248M',
          { device: 'cpu' }
        );
        console.log('AI therapy model loaded on CPU');
      } catch (cpuError) {
        console.error('Failed to load AI model on CPU:', cpuError);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async generateTherapyResponse(userMessage: string, therapyType: string, conversationHistory: string[] = []): Promise<string> {
    if (!this.textGenerator) {
      await this.initialize();
    }

    if (!this.textGenerator) {
      return this.getFallbackResponse(userMessage, therapyType);
    }

    try {
      // Create a more natural therapy conversation prompt
      const therapistPersonality = this.getTherapistPersonality(therapyType);
      const prompt = this.buildTherapyPrompt(userMessage, therapyType, conversationHistory, therapistPersonality);

      const result = await this.textGenerator(prompt, {
        max_new_tokens: 80,
        temperature: 0.8,
        do_sample: true,
        repetition_penalty: 1.2,
        pad_token_id: 0,
      });

      let response = '';
      if (Array.isArray(result)) {
        response = result[0]?.generated_text || '';
      } else {
        response = result.generated_text || '';
      }

      // Clean and process the response
      const cleanResponse = this.cleanTherapyResponse(response, prompt);
      
      // Ensure we have a meaningful response
      if (cleanResponse.length < 15 || this.isGenericResponse(cleanResponse)) {
        return this.getFallbackResponse(userMessage, therapyType);
      }

      return cleanResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage, therapyType);
    }
  }

  private buildTherapyPrompt(userMessage: string, therapyType: string, conversationHistory: string[], personality: string): string {
    const recentHistory = conversationHistory.slice(-3).join('\n');
    const context = recentHistory ? `Previous conversation:\n${recentHistory}\n\n` : '';
    
    return `You are ${personality}

${context}Client: "${userMessage}"

Therapist response:`;
  }

  private getTherapistPersonality(therapyType: string): string {
    const personalities = {
      cbt: "a warm, insightful Cognitive Behavioral Therapist. You help clients examine their thought patterns with gentle curiosity. You ask thoughtful questions about the connection between thoughts, feelings, and behaviors. You're supportive but also help people challenge unhelpful thinking patterns.",
      dbt: "a compassionate Dialectical Behavior Therapist. You focus on helping clients develop emotional regulation skills and mindfulness. You validate their emotions while teaching practical coping strategies. You often guide clients toward acceptance and change strategies.",
      general: "a caring, empathetic therapist. You create a safe space for people to share their feelings. You listen actively, reflect back what you hear, and ask open-ended questions to help clients explore their experiences more deeply."
    };

    return personalities[therapyType as keyof typeof personalities] || personalities.general;
  }

  private cleanTherapyResponse(response: string, prompt: string): string {
    // Remove the prompt from the response
    let cleaned = response.replace(prompt, '').trim();
    
    // Remove common AI artifacts
    cleaned = cleaned.replace(/^(Therapist response:|Therapist:|Response:)/i, '').trim();
    cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
    cleaned = cleaned.split('\n')[0]; // Take only the first line
    cleaned = cleaned.replace(/\s+/g, ' '); // Normalize whitespace
    
    // Ensure it ends properly
    if (cleaned && !cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }

    return cleaned;
  }

  private isGenericResponse(response: string): boolean {
    const genericPhrases = [
      'I understand',
      'That sounds',
      'Can you tell me more',
      'How does that make you feel',
      'I see',
      'Thank you for sharing'
    ];
    
    return genericPhrases.some(phrase => 
      response.toLowerCase().includes(phrase.toLowerCase()) && response.length < 30
    );
  }

  private getFallbackResponse(userMessage: string, therapyType: string): string {
    // Analyze the user's message for more contextual responses
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('good') || messageLower.includes('great') || messageLower.includes('awesome')) {
      return this.getPositiveResponses(therapyType);
    }
    
    if (messageLower.includes('sad') || messageLower.includes('depressed') || messageLower.includes('down')) {
      return this.getSadnessResponses(therapyType);
    }
    
    if (messageLower.includes('anxious') || messageLower.includes('worried') || messageLower.includes('stress')) {
      return this.getAnxietyResponses(therapyType);
    }
    
    if (messageLower.includes('angry') || messageLower.includes('mad') || messageLower.includes('frustrated')) {
      return this.getAngerResponses(therapyType);
    }

    return this.getGeneralResponses(therapyType);
  }

  private getPositiveResponses(therapyType: string): string {
    const responses = [
      "That's wonderful to hear! What specifically about this experience feels good to you?",
      "I can hear the positivity in what you're sharing. What do you think contributed to feeling this way?",
      "It sounds like things are going well for you right now. How can we build on these positive feelings?",
      "I'm glad you're experiencing something positive. What would you like to explore about this feeling?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSadnessResponses(therapyType: string): string {
    const responses = [
      "I hear that you're going through a difficult time. Can you help me understand what's weighing on you most right now?",
      "Sadness can feel overwhelming. What thoughts tend to come up when you're feeling this way?",
      "Thank you for trusting me with these difficult feelings. What would feel most supportive right now?",
      "It takes courage to acknowledge when we're struggling. What has this sadness been like for you day to day?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAnxietyResponses(therapyType: string): string {
    const responses = [
      "Anxiety can feel really intense. Where do you notice it most in your body when it comes up?",
      "I hear the worry in what you're sharing. What thoughts tend to fuel this anxious feeling?",
      "When you're feeling anxious like this, what usually helps you feel more grounded?",
      "That sounds like a lot to carry. Can you tell me what specifically is making you feel most worried?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAngerResponses(therapyType: string): string {
    const responses = [
      "Anger often tells us something important. What do you think this feeling is trying to communicate?",
      "I can hear the intensity of what you're experiencing. What happened that triggered these feelings?",
      "It sounds like something really significant happened. Can you walk me through what led to feeling this way?",
      "Anger can be such a powerful emotion. What would it be like to explore what's underneath this feeling?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGeneralResponses(therapyType: string): string {
    const responses = [
      "I'm really glad you shared that with me. What feels most important for us to focus on right now?",
      "I can sense there's a lot going on for you. What would be most helpful to explore together?",
      "Thank you for opening up about this. What thoughts or feelings are strongest for you as you talk about this?",
      "I appreciate you trusting me with what you're experiencing. What stands out most to you about this situation?",
      "It sounds like this is really significant for you. Can you help me understand what this means to you?",
      "I want to make sure I understand what you're going through. What would you like me to know about your experience?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  isModelReady(): boolean {
    return !!this.textGenerator && !this.isLoading;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const aiTherapyService = new AITherapyService();
