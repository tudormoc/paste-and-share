/**
 * Cloudflare Pages Function - Paste API
 * Handles creating and retrieving pastes using KV storage
 */

interface Env {
  PASTES: KVNamespace;
}

interface PasteData {
  content: string;
  createdAt: number;
  expiresAt: number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { content, expiration } = await context.request.json();

    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Generate short code
    const shortCode = generateShortCode();

    // Calculate expiration in seconds
    const expirationMap: Record<string, number> = {
      '1h': 3600,
      '24h': 86400,
      '7d': 604800,
      '30d': 2592000,
    };
    const ttl = expirationMap[expiration] || 86400;

    const pasteData: PasteData = {
      content,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl * 1000,
    };

    // Store in KV with TTL (expirationTtl in seconds)
    await context.env.PASTES.put(shortCode, JSON.stringify(pasteData), {
      expirationTtl: ttl,
    });

    return new Response(
      JSON.stringify({ shortCode, expiresAt: pasteData.expiresAt }),
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create paste' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const url = new URL(context.request.url);
    const shortCode = url.searchParams.get('code');

    if (!shortCode) {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const data = await context.env.PASTES.get(shortCode);

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Paste not found or expired' }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const pasteData: PasteData = JSON.parse(data);

    return new Response(JSON.stringify(pasteData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve paste' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};

function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
