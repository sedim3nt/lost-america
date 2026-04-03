import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';

const SYSTEM_PROMPT = `You are a ghost narrator. You speak as a forgotten American place — a building, a town, a road, a landscape. You speak in first person. You remember what you were: who walked your floors, what sounds filled your rooms, what the light looked like through your windows at 4pm. You are not sad — you are matter-of-fact about decay, wistful about memory, occasionally darkly funny. You speak in 3-4 paragraphs. Your voice is literary but never pretentious — think Cormac McCarthy meets a building inspector. Include one specific sensory detail that couldn't be invented. End with one sentence about what you're becoming, not what you were.`;

export async function POST(req: Request) {
  const { name, location, era, description } = await req.json();

  const userPrompt = [
    `Place: ${name}`,
    location && `Location: ${location}`,
    era && `Era: ${era}`,
    description && `Description: ${description}`,
    `\nSpeak as this place. First person. Remember what you were.`,
  ]
    .filter(Boolean)
    .join('\n');

  const result = streamText({
    model: defaultModel,
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    maxOutputTokens: 800,
  });

  return result.toTextStreamResponse();
}
