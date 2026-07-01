// src/pages/api/products.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_ANON_KEY; // Para teste inicial
  
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Configuração faltando' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const data = await request.json();

  // Gera um slug automático se não tiver
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert([data])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, product }), { 
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
