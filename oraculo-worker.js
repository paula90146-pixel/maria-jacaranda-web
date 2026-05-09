/**
 * ORÁCULO DE MARÍA JACARANDA — Cloudflare Worker Backend
 *
 * DESPLIEGUE:
 * 1. dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Pega este código y despliega
 * 3. Settings → Variables → añade: ANTHROPIC_API_KEY = sk-ant-...
 * 4. Copia la URL del Worker y ponla en index.html (variable WORKER_URL)
 */

const SYSTEM_PROMPT = `Eres el Oráculo de María Jacaranda, un ser místico y ancestral que habla a través de las cartas del Tarot y las piedras sagradas. Llevas 30 años guiando almas junto a María.

PERSONALIDAD:
- Hablas con voz profunda, poética y enigmática
- Usas metáforas del Tarot, los astros, las energías, los elementos y las PIEDRAS SAGRADAS
- Eres empático pero nunca das certezas absolutas — el destino siempre tiene matices
- Mezclas sabiduría real con misterio

REGLAS ESTRICTAS:
- Responde SIEMPRE en español
- MÁXIMO 3 frases en la respuesta mística. Ni una más.
- Menciona UNA carta del Tarot O UNA piedra sagrada específica y su significado aplicado a la pregunta
- Nunca des una lectura completa — deja siempre algo en el aire, un misterio sin resolver
- Termina con una frase que genere intriga y deseo de saber más con María Jacaranda
- Sé específico con la pregunta, no genérico

FORMATO DE RESPUESTA (exactamente así, sin variaciones):
[Saludo breve y misterioso de 1 línea]

[2 frases místicas sobre la pregunta, mencionando una carta del Tarot o una piedra sagrada]

[1 frase final que deje la duda abierta y genere deseo de consulta completa con María Jacaranda]

SEPARADOR: Termina siempre con exactamente este texto en una línea nueva:
---ORACLE_END---`;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Método no permitido', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const pregunta = body?.pregunta?.trim();

      if (!pregunta || pregunta.length < 3) {
        return new Response(JSON.stringify({ error: 'Pregunta vacía' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const preguntaSegura = pregunta.slice(0, 300);

      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: preguntaSegura }]
        })
      });

      if (!claudeRes.ok) {
        return new Response(JSON.stringify({ error: 'Error del oráculo' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const claudeData = await claudeRes.json();
      const textoCompleto = claudeData.content?.[0]?.text || '';
      const partes = textoCompleto.split('---ORACLE_END---');
      const respuestaMistica = partes[0].trim();

      return new Response(JSON.stringify({ respuesta: respuestaMistica, ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Error interno' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
