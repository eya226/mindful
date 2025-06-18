
import { pipeline } from '@huggingface/transformers';

class AITherapyService {
  private textGenerator: any = null;
  private isLoading = false;

  async initialize() {
    if (this.textGenerator || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Initializing AI therapy model...');
    
    try {
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
      return this.getContextualResponse(userMessage, therapyType, conversationHistory);
    }

    try {
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

      const cleanResponse = this.cleanTherapyResponse(response, prompt);
      
      if (cleanResponse.length < 20 || this.isGenericResponse(cleanResponse)) {
        return this.getContextualResponse(userMessage, therapyType, conversationHistory);
      }

      return cleanResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getContextualResponse(userMessage, therapyType, conversationHistory);
    }
  }

  private buildNaturalTherapyPrompt(userMessage: string, therapyType: string, conversationHistory: string[]): string {
    const recentHistory = conversationHistory.slice(-2).join('\n');
    const context = recentHistory ? `${recentHistory}\n` : '';
    
    return `${context}Human: ${userMessage}
Therapist:`;
  }

  private cleanTherapyResponse(response: string, prompt: string): string {
    let cleaned = response.replace(prompt, '').trim();
    cleaned = cleaned.replace(/^(Therapist:|Human:|Response:|Assistant:)/i, '').trim();
    cleaned = cleaned.replace(/^["']|["']$/g, '');
    cleaned = cleaned.split('\n')[0];
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    const sentences = cleaned.split(/[.!?]+/);
    if (sentences.length > 1 && sentences[sentences.length - 1].trim().length < 10) {
      sentences.pop();
      cleaned = sentences.join('.') + (sentences.length > 0 ? '.' : '');
    }
    
    if (cleaned && !cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }

    return cleaned;
  }

  private isGenericResponse(response: string): boolean {
    const genericPhrases = [
      'I understand', 'That sounds', 'Can you tell me more', 'How does that make you feel',
      'I see', 'Thank you for sharing', 'I hear what you\'re saying', 'That must be', 'It sounds like'
    ];
    
    const lowerResponse = response.toLowerCase();
    return genericPhrases.some(phrase => 
      lowerResponse.startsWith(phrase.toLowerCase()) && response.length < 40
    );
  }

  private getContextualResponse(userMessage: string, therapyType: string, conversationHistory: string[]): string {
    const messageLower = userMessage.toLowerCase();
    const recentContext = conversationHistory.slice(-3).join(' ').toLowerCase();
    
    // Mental Health & Emotional States
    if (this.matchesContext(messageLower, ['depressed', 'depression', 'hopeless', 'empty', 'numb', 'worthless'])) {
      return this.getRandomResponse([
        "Depression can make everything feel colorless and heavy. When you say you feel hopeless, what does that look like in your day-to-day life? Are there moments, even small ones, where that feeling lifts slightly?",
        "That emptiness you're describing - it's like being in a fog where nothing feels real or meaningful. I'm wondering, when did you first notice this feeling settling in? Was it gradual or did something specific trigger it?",
        "Feeling worthless is one of depression's cruelest tricks - it convinces us that we don't matter when that couldn't be further from the truth. What would someone who truly cares about you say about your worth right now?"
      ]);
    }

    if (this.matchesContext(messageLower, ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'overwhelmed'])) {
      return this.getRandomResponse([
        "Anxiety has this way of making our minds race ahead to all the worst-case scenarios. When you feel that overwhelming worry, where do you feel it most in your body? Your chest, your stomach, your shoulders?",
        "That constant state of being on edge is exhausting. It's like your nervous system is stuck in high alert mode. What situations tend to trigger these anxious feelings most intensely for you?",
        "Panic can feel like you're drowning even when you're on dry land. When these episodes hit, what thoughts are usually racing through your mind? What does your body tell you in those moments?"
      ]);
    }

    // Relationship Issues
    if (this.matchesContext(messageLower, ['relationship', 'partner', 'boyfriend', 'girlfriend', 'husband', 'wife', 'marriage', 'divorce'])) {
      return this.getRandomResponse([
        "Relationships can be some of our deepest sources of joy and our most profound sources of pain. What's been the most challenging part of navigating this situation with your partner?",
        "It sounds like there's a lot of complexity in your relationship right now. When you think about what you need most from your partner, what comes to mind first?",
        "The dynamic between you two seems to be causing you real distress. Can you help me understand what a good day looks like versus a difficult day in your relationship?"
      ]);
    }

    if (this.matchesContext(messageLower, ['family', 'parents', 'mother', 'father', 'mom', 'dad', 'siblings', 'toxic family'])) {
      return this.getRandomResponse([
        "Family relationships can be the most complicated because we don't choose them, yet they shape us so deeply. What's been the hardest part about dealing with your family situation?",
        "The pain that comes from family conflict runs so deep because these are the people who are supposed to be our safe harbor. How long have you been struggling with these family dynamics?",
        "Growing up in a challenging family environment can leave lasting marks on how we see ourselves and relationships. What patterns from your family do you find yourself either repeating or desperately trying to avoid?"
      ]);
    }

    // Work & Career Stress
    if (this.matchesContext(messageLower, ['work', 'job', 'boss', 'career', 'burnout', 'workplace', 'coworker', 'unemployed'])) {
      return this.getRandomResponse([
        "Work stress can seep into every area of our lives, making it hard to switch off even when we're home. What's been the most draining aspect of your work situation lately?",
        "Burnout is like running on fumes - you're going through the motions but everything feels harder than it should. When did you first notice that work was starting to take this toll on you?",
        "The pressure to perform and succeed can be overwhelming, especially when it feels like your livelihood depends on it. What would need to change for you to feel more balanced in your work life?"
      ]);
    }

    // Trauma & PTSD
    if (this.matchesContext(messageLower, ['trauma', 'ptsd', 'flashbacks', 'triggered', 'abuse', 'assault', 'accident'])) {
      return this.getRandomResponse([
        "Trauma has a way of hijacking our sense of safety and control. When you experience these flashbacks or triggers, what helps you feel most grounded in the present moment?",
        "Your body and mind are trying to protect you from re-experiencing that pain, but sometimes those protective mechanisms can feel overwhelming. What does safety look like for you right now?",
        "Healing from trauma isn't linear - there are good days and setbacks, and that's completely normal. How are you being gentle with yourself through this process?"
      ]);
    }

    // Grief & Loss
    if (this.matchesContext(messageLower, ['grief', 'loss', 'died', 'death', 'funeral', 'mourning', 'miss', 'gone'])) {
      return this.getRandomResponse([
        "Grief is love with nowhere to go, and it can feel like carrying a weight that shifts but never fully lifts. What's been the hardest part about navigating life without them?",
        "Loss changes everything - the world feels different, like you're living in a reality that doesn't quite fit anymore. What do you miss most about them, beyond just their presence?",
        "There's no timeline for grief, no matter what anyone tells you. Some days the pain feels fresh, other days it's a dull ache. How has your grief been showing up for you lately?"
      ]);
    }

    // Self-Esteem & Identity
    if (this.matchesContext(messageLower, ['self-esteem', 'confidence', 'self-worth', 'identity', 'who am i', 'not good enough'])) {
      return this.getRandomResponse([
        "That inner critic can be so much harsher than we'd ever be to a friend. When you hear that voice telling you you're not good enough, whose voice does it sound like?",
        "Building self-worth after it's been damaged is like tending to a garden that's been neglected - it takes time, patience, and consistent care. What would treating yourself with compassion look like?",
        "Identity can feel so fluid and confusing, especially when we're going through major life changes. What parts of yourself feel most authentic and true, even when everything else feels uncertain?"
      ]);
    }

    // Addiction & Recovery
    if (this.matchesContext(messageLower, ['addiction', 'substance', 'drinking', 'drugs', 'recovery', 'relapse', 'sober'])) {
      return this.getRandomResponse([
        "Addiction is often about trying to fill a void or numb pain that feels unbearable. What were you hoping the substance would do for you when you first started using it?",
        "Recovery is one of the bravest things someone can do - it requires facing all the things we were trying to escape. What's been your biggest motivation to get clean?",
        "Relapse doesn't erase your progress; it's often part of the journey. What triggered this setback, and what can we learn from it to strengthen your recovery moving forward?"
      ]);
    }

    // Eating Disorders & Body Image
    if (this.matchesContext(messageLower, ['eating', 'food', 'weight', 'body image', 'fat', 'skinny', 'diet', 'binge'])) {
      return this.getRandomResponse([
        "Your relationship with food and your body is so deeply personal and complex. When did you first notice that food became more than just nourishment for you?",
        "Body image distortion can make mirrors feel like funhouse mirrors - what you see doesn't match reality. What does your body mean to you beyond its appearance?",
        "Eating disorders often serve a purpose - control, comfort, punishment. What do you think your eating patterns are trying to help you cope with?"
      ]);
    }

    // Sleep & Health Issues
    if (this.matchesContext(messageLower, ['sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'nightmares'])) {
      return this.getRandomResponse([
        "Sleep issues can create a vicious cycle - the more worried you get about not sleeping, the harder it becomes to actually fall asleep. What's usually going through your mind when you're lying awake?",
        "Chronic exhaustion affects everything - your mood, your relationships, your ability to cope with daily stress. How long have you been struggling with sleep?",
        "Nightmares can make sleep feel unsafe, like your subconscious is working overtime to process difficult emotions. Do you notice any patterns in what triggers these bad dreams?"
      ]);
    }

    // Financial Stress
    if (this.matchesContext(messageLower, ['money', 'financial', 'debt', 'bills', 'broke', 'can\'t afford', 'bankruptcy'])) {
      return this.getRandomResponse([
        "Financial stress can feel all-consuming because it touches every aspect of our lives. What's been the most overwhelming part of dealing with these money concerns?",
        "The shame and anxiety around financial struggles can be just as difficult as the practical challenges. How has this situation been affecting your relationships and daily life?",
        "Money problems can make you feel like you're drowning, especially when it feels like there's no way out. What would financial stability look like for you right now?"
      ]);
    }

    // Loneliness & Social Isolation
    if (this.matchesContext(messageLower, ['lonely', 'alone', 'isolated', 'no friends', 'social anxiety', 'withdrawn'])) {
      return this.getRandomResponse([
        "Loneliness can feel like being surrounded by people but still feeling completely unseen and misunderstood. What's been the hardest part about feeling so disconnected from others?",
        "Social isolation can become a self-reinforcing cycle - the longer we're alone, the harder it feels to reach out. When did you first start pulling away from people?",
        "That ache of wanting connection but not knowing how to create it safely - it's one of the most human struggles there is. What would meaningful connection look like for you?"
      ]);
    }

    // Anger & Aggression
    if (this.matchesContext(messageLower, ['angry', 'rage', 'furious', 'hate', 'violent', 'explosive', 'can\'t control'])) {
      return this.getRandomResponse([
        "Anger is often pain wearing a mask - it can feel safer to be mad than to be hurt. What do you think might be underneath that rage you're feeling?",
        "When anger feels that explosive and uncontrollable, it's usually because there's been a lot building up for a long time. What first lit that fuse for you?",
        "Rage can be terrifying, both for you and for the people around you. What scares you most about your anger? What would it mean to find healthier ways to express it?"
      ]);
    }

    // Perfectionism & Control
    if (this.matchesContext(messageLower, ['perfectionist', 'control', 'everything has to be perfect', 'obsessive', 'can\'t let go'])) {
      return this.getRandomResponse([
        "Perfectionism can be a prison disguised as high standards. What are you most afraid will happen if things aren't perfect?",
        "The need to control everything often comes from feeling like things were out of control at some point. What does letting go feel like to you - scary, impossible, or something else?",
        "That drive for perfection can be exhausting - it's like running a race where the finish line keeps moving. What would 'good enough' look like in your life?"
      ]);
    }

    // Therapy-specific responses based on therapy type
    if (therapyType === 'cbt') {
      return this.getRandomResponse([
        "Let's explore the thoughts that were running through your mind in that situation. What was the first thing you remember thinking when this happened?",
        "I'm noticing a pattern in how you're interpreting these events. What evidence do you have that supports this thought, and what evidence might challenge it?",
        "Those automatic thoughts can feel so real and true in the moment. If a good friend came to you with this same thought, what would you tell them?"
      ]);
    }

    if (therapyType === 'dbt') {
      return this.getRandomResponse([
        "Let's pause for a moment and practice some mindfulness. What are you noticing in your body right now as you tell me about this?",
        "This sounds like a moment where distress tolerance skills could be really helpful. What techniques have you tried before when emotions feel this intense?",
        "I can hear the emotion in your voice. What would it look like to hold space for this feeling without trying to fix it or make it go away right now?"
      ]);
    }

    // Default contextual responses
    const defaultResponses = [
      "There's so much complexity in what you're sharing with me. What feels most important for you to focus on right now?",
      "I can hear that this is really weighing on you. What would it mean for you if this situation started to feel different?",
      "The way you're describing this tells me how much it's been affecting you. What's been the most challenging part about navigating this?",
      "It takes real courage to open up about something this personal. What's been on your mind about this situation lately?",
      "I'm struck by how much you're carrying right now. What kind of support would feel most helpful to you in this moment?",
      "What you're going through sounds incredibly difficult. How has this been impacting other areas of your life?",
      "I can sense the pain in what you're telling me. What would you want someone who cares about you to know about what you're experiencing?",
      "This situation seems to be touching on something really deep for you. What comes up for you when you think about how this all started?",
      "There's a lot of emotion in what you're sharing. What would it look like to be gentler with yourself as you work through this?",
      "I'm hearing how much this matters to you. What hopes do you have for how things might change or heal?"
    ];

    return this.getRandomResponse(defaultResponses);
  }

  private matchesContext(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getFallbackResponse(userMessage: string, therapyType: string): string {
    return this.getContextualResponse(userMessage, therapyType, []);
  }

  isModelReady(): boolean {
    return !!this.textGenerator && !this.isLoading;
  }

  isInitializing(): boolean {
    return this.isLoading;
  }
}

export const aiTherapyService = new AITherapyService();
