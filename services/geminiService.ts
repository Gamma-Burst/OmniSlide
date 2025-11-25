import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Slide, ContentBlock } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ API Key not configured. Using mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePresentationContent = async (topic: string, context: string): Promise<Slide[]> => {
  const ai = getAiClient();
  
  // Mode mock si pas d'API key
  if (!ai) {
    return generateMockSlides(topic);
  }
  
  const prompt = `
    Role: You are a world-class presentation designer and storyteller using the "Deep Context" method.
    
    Input Context:
    ${context}

    Task: Create a structured presentation for the topic: "${topic}".
    
    Requirements:
    1. Analyze the context and extract 5 key themes/chapters.
    2. For each theme, generate a slide.
    3. Each slide must have a title, a list of 3-4 distinct content points (blocks), comprehensive speaker notes, and a HIGHLY DETAILED image generation prompt for Imagen 3.
    4. The image prompt should describe a visual metaphor or a clean, modern, abstract 3D visualization suitable for a tech presentation.
    5. Assign a layout type (standard, split, hero).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of bullet points for the slide body"
              },
              notes: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              layout: { type: Type.STRING, enum: ['standard', 'split', 'hero'] }
            },
            required: ['title', 'points', 'notes', 'imagePrompt', 'layout']
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from AI");
    
    const rawSlides = JSON.parse(jsonStr);
    
    // Transform to internal Block model
    return rawSlides.map((s: any, index: number) => {
      const blocks: ContentBlock[] = s.points.map((point: string, i: number) => ({
        id: `block-${Date.now()}-${index}-${i}`,
        type: 'text',
        content: point
      }));

      return {
        id: `slide-${Date.now()}-${index}`,
        title: s.title,
        blocks: blocks,
        notes: s.notes,
        imagePrompt: s.imagePrompt,
        layout: s.layout
      };
    });

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return generateMockSlides(topic);
  }
};

export const generatePodcastAudio = async (slides: Slide[]): Promise<string | null> => {
  const ai = getAiClient();

  if (!ai) {
    alert("⚠️ API Key not configured. Audio generation unavailable.");
    return null;
  }

  const scriptContext = slides.map(s => {
    const content = s.blocks.map(b => b.content).join(' ');
    return `Slide: ${s.title}\nContent: ${content}\nNotes: ${s.notes}`;
  }).join('\n\n');

  const prompt = `
    Generate a short, lively, and dynamic podcast intro (approx 45 seconds) summarizing this presentation content.
    Style: Two hosts (Alex and Sam) discussing the key takeaways excitedly. It should feel like a snippet from a real tech podcast.
    Content to discuss:
    ${scriptContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// Mock slides pour tester sans API
function generateMockSlides(topic: string): Slide[] {
  console.log("🎭 Generating mock slides for:", topic);
  return [
    {
      id: `slide-${Date.now()}-0`,
      title: topic,
      blocks: [
        {
          id: `block-${Date.now()}-0-0`,
          type: 'text',
          content: 'Introduction au sujet'
        },
        {
          id: `block-${Date.now()}-0-1`,
          type: 'text',
          content: 'Vue d\'ensemble des concepts clés'
        }
      ],
      notes: 'Notes d\'introduction pour le présentateur',
      imagePrompt: 'Modern abstract 3D visualization with flowing gradients',
      layout: 'hero'
    },
    {
      id: `slide-${Date.now()}-1`,
      title: 'Contexte et enjeux',
      blocks: [
        {
          id: `block-${Date.now()}-1-0`,
          type: 'text',
          content: 'Analyse du contexte actuel'
        },
        {
          id: `block-${Date.now()}-1-1`,
          type: 'text',
          content: 'Principaux défis identifiés'
        },
        {
          id: `block-${Date.now()}-1-2`,
          type: 'text',
          content: 'Opportunités à saisir'
        }
      ],
      notes: 'Expliquer le contexte et les enjeux stratégiques',
      imagePrompt: 'Clean geometric shapes representing challenges',
      layout: 'split'
    },
    {
      id: `slide-${Date.now()}-2`,
      title: 'Conclusion',
      blocks: [
        {
          id: `block-${Date.now()}-2-0`,
          type: 'text',
          content: 'Résumé des points clés'
        },
        {
          id: `block-${Date.now()}-2-1`,
          type: 'text',
          content: 'Prochaines étapes'
        }
      ],
      notes: 'Conclure avec impact',
      imagePrompt: 'Inspiring future vision visualization',
      layout: 'standard'
    }
  ];
}