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
      const prompt = this.buildNaturalTherapyPrompt(userMessage, therapyType, conversationHistory);

      const result = await this.textGenerator(prompt, {
        max_new_tokens: 60,
        temperature: 0.9,
        do_sample: true,
        repetition_penalty: 1.3,
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
      if (cleanResponse.length < 20 || this.isGenericResponse(cleanResponse)) {
        return this.getContextualFallbackResponse(userMessage, therapyType);
      }

      return cleanResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getContextualFallbackResponse(userMessage, therapyType);
    }
  }

  private buildNaturalTherapyPrompt(userMessage: string, therapyType: string, conversationHistory: string[]): string {
    const recentHistory = conversationHistory.slice(-2).join('\n');
    const context = recentHistory ? `${recentHistory}\n` : '';
    
    // More natural conversation format
    return `${context}Human: ${userMessage}
Therapist:`;
  }

  private cleanTherapyResponse(response: string, prompt: string): string {
    // Remove the prompt from the response
    let cleaned = response.replace(prompt, '').trim();
    
    // Remove common AI artifacts and formatting
    cleaned = cleaned.replace(/^(Therapist:|Human:|Response:|Assistant:)/i, '').trim();
    cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
    cleaned = cleaned.split('\n')[0]; // Take only the first line
    cleaned = cleaned.replace(/\s+/g, ' '); // Normalize whitespace
    
    // Remove incomplete sentences at the end
    const sentences = cleaned.split(/[.!?]+/);
    if (sentences.length > 1 && sentences[sentences.length - 1].trim().length < 10) {
      sentences.pop();
      cleaned = sentences.join('.') + (sentences.length > 0 ? '.' : '');
    }
    
    // Ensure it ends properly if it doesn't already
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
      'Thank you for sharing',
      'I hear what you\'re saying',
      'That must be',
      'It sounds like'
    ];
    
    const lowerResponse = response.toLowerCase();
    return genericPhrases.some(phrase => 
      lowerResponse.startsWith(phrase.toLowerCase()) && response.length < 40
    );
  }

  private getContextualFallbackResponse(userMessage: string, therapyType: string): string {
    const messageLower = userMessage.toLowerCase();
    
    // More specific contextual responses based on message content
    if (messageLower.includes('app') || messageLower.includes('developing') || messageLower.includes('code') || messageLower.includes('bug')) {
      const workStressResponses = [
        "Working on development projects can be really draining, especially when you're hitting roadblocks. The cycle of encountering bugs and trying to fix them can feel endless sometimes. What's been the most frustrating part for you?",
        "It sounds like the development work is taking a real toll on you. When you're deep in that cycle of problems and failures, it can feel like you're not making progress. How long have you been dealing with this particular project?",
        "Development work has this unique way of making us feel like we're constantly fighting uphill battles. Those bug cycles can be mentally exhausting. What usually helps you step back when you're feeling stuck like this?"
      ];
      return workStressResponses[Math.floor(Math.random() * workStressResponses.length)];
    }
    
    if (messageLower.includes('disappointed') || messageLower.includes('disappointing')) {
      const disappointmentResponses = [
        "Disappointment can cut really deep, especially when we had hopes or expectations about something. What was it that you were hoping would be different?",
        "That feeling of disappointment can be so heavy to carry. It sounds like something you were counting on didn't work out the way you needed it to. Can you tell me more about what happened?",
        "When disappointment hits, it can color everything else around us. What's been the hardest part about dealing with this particular disappointment?"
      ];
      return disappointmentResponses[Math.floor(Math.random() * disappointmentResponses.length)];
    }
    
    if (messageLower.includes('sad') || messageLower.includes('sadness')) {
      const sadnessResponses = [
        "Sadness has this way of settling into our daily lives and making everything feel heavier. You mentioned it varies day to day - are there particular things that tend to make the sad days worse?",
        "It takes real strength to acknowledge when sadness is affecting your daily life. Some days being harder than others is so common with what you're going through. What does a particularly difficult day look like for you?",
        "Living with sadness that changes from day to day can be exhausting because you never know what to expect. On the days when it feels extra heavy, what do you find yourself thinking about most?"
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }

    // ... keep existing code (other emotion-specific responses)
    
    // More natural general responses
    const naturalResponses = [
      "What you're describing sounds really challenging. I'm curious about how this has been affecting other parts of your life too.",
      "It takes courage to open up about what you're going through. What's been on your mind about this situation lately?",
      "I can hear that this is weighing on you. Sometimes it can help to explore what this experience has been like for you day-to-day.",
      "There's a lot in what you're sharing. What feels most important for you to focus on right now?",
      "It sounds like you're dealing with something significant. What's been the hardest part about navigating this?",
      "I appreciate you being so open about your experience. What would it mean to you if things started to feel different?"
    ];
    
    return naturalResponses[Math.floor(Math.random() * naturalResponses.length)];
  }

  private getFallbackResponse(userMessage: string, therapyType: string): string {
    return this.getContextualFallbackResponse(userMessage, therapyType);
  }

  isModelReady(): boolean {
    return !!this.textGenerator && !this.isLoading;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const aiTherapyService = new AITherapyService();
