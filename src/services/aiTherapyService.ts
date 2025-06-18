
import { pipeline } from '@huggingface/transformers';

class AITherapyService {
  private textGenerator: any = null;
  private isLoading = false;

  async initialize() {
    if (this.textGenerator || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Initializing AI therapy model...');
    
    try {
      // Use a small, efficient model for therapy conversations
      this.textGenerator = await pipeline(
        'text-generation',
        'Xenova/DialoGPT-small',
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
          'Xenova/DialoGPT-small',
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
      // Create therapy-focused prompt based on therapy type
      const systemPrompt = this.getSystemPrompt(therapyType);
      const context = conversationHistory.slice(-4).join(' '); // Last 4 messages for context
      const prompt = `${systemPrompt}\n\nPrevious conversation: ${context}\nUser: ${userMessage}\nTherapist:`;

      const result = await this.textGenerator(prompt, {
        max_new_tokens: 100,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256,
      });

      // Extract the generated response
      let response = '';
      if (Array.isArray(result)) {
        response = result[0]?.generated_text || '';
      } else {
        response = result.generated_text || '';
      }

      // Clean up the response to extract only the therapist's reply
      const therapistResponse = response
        .split('Therapist:')
        .pop()
        ?.split('User:')[0]
        ?.trim() || '';

      // Ensure we have a meaningful response
      if (therapistResponse.length < 10) {
        return this.getFallbackResponse(userMessage, therapyType);
      }

      return therapistResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage, therapyType);
    }
  }

  private getSystemPrompt(therapyType: string): string {
    const prompts = {
      cbt: "You are a compassionate Cognitive Behavioral Therapist. Help the user identify thought patterns and develop coping strategies. Ask thoughtful questions about their thoughts and feelings.",
      dbt: "You are a skilled Dialectical Behavior Therapist. Focus on mindfulness, distress tolerance, and emotional regulation. Help the user practice acceptance and change strategies.",
      general: "You are a supportive and empathetic therapist. Listen actively, validate feelings, and guide the conversation in a helpful direction."
    };

    return prompts[therapyType as keyof typeof prompts] || prompts.general;
  }

  private getFallbackResponse(userMessage: string, therapyType: string): string {
    const responses = {
      cbt: [
        "I hear what you're saying. Can you help me understand what thoughts were going through your mind when this happened?",
        "That sounds challenging. Let's explore the connection between your thoughts and feelings about this situation.",
        "Thank you for sharing that. What evidence do you have for and against this thought?",
      ],
      dbt: [
        "Thank you for sharing that with me. Let's practice some mindfulness - what are you noticing in your body right now?",
        "I can hear the emotion in what you're telling me. What skills might help you navigate this feeling?",
        "That sounds really difficult. How can we use distress tolerance skills to help you through this?",
      ],
      general: [
        "I'm here to listen and support you. Can you tell me more about how you're feeling?",
        "That sounds important to you. How has this been affecting your daily life?",
        "Thank you for trusting me with this. What would feel most helpful to explore right now?",
      ],
    };

    const typeResponses = responses[therapyType as keyof typeof responses] || responses.general;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  }

  isModelReady(): boolean {
    return !!this.textGenerator && !this.isLoading;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const aiTherapyService = new AITherapyService();
