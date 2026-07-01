// functions/api/products/index.ts
import { createClient } from '@supabase/supabase-js';

export const onRequestPost = async (context: any) => {
  try {
    // Pega as variáveis de ambiente da Cloudflare
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Configuração faltando' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await context.request.json();

    // Gera slug se não tiver
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Converte preços para número (o FormData envia como string)
    if (data.price_brl) data.price_brl = parseFloat(data.price_brl);
    if (data.price_usd) data.price_usd = parseFloat(data.price_usd);
    if (data.collection_id === "") data.collection_id = null;

    const { data: product, error } = await supabase
      .from('products')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({ success: true, product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

// Adiciona suporte a OPTIONS para CORS (navegador às vezes pede antes do POST)
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
