// functions/api/products/index.ts
import { createClient } from '@supabase/supabase-js';

// --- GET: Listar Produtos ---
export const onRequestGet = async (context: any) => {
  try {
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Config missing');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: products, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data: products }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

// --- POST: Criar Produto ---
export const onRequestPost = async (context: any) => {
  try {
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Config missing');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await context.request.json();

    if (!data.slug && data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (data.price_brl) data.price_brl = parseFloat(data.price_brl);
    if (data.price_usd) data.price_usd = parseFloat(data.price_usd);
    if (data.collection_id === "") data.collection_id = null;

    const { data: product, error } = await supabase.from('products').insert([data]).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, product }), {
      status: 201, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};

// --- PUT: Editar Produto (CORRIGIDO) ---
export const onRequestPut = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    
    if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });

    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Config missing');

    const supabase = createClient(supabaseUrl, supabaseKey);
    let data = await context.request.json();

    // ⚠️ FILTRO DE SEGURANÇA: Envia APENAS campos editáveis para o Supabase
    const allowedFields = ['name', 'slug', 'type', 'collection_id', 'description', 'thumbnail_url', 'price_brl', 'price_usd', 'status'];
    const cleanData: any = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) cleanData[field] = data[field];
    });

    // Converte tipos numéricos
    if (cleanData.price_brl) cleanData.price_brl = parseFloat(cleanData.price_brl);
    if (cleanData.price_usd) cleanData.price_usd = parseFloat(cleanData.price_usd);
    if (cleanData.collection_id === "") cleanData.collection_id = null;

    const { data: product, error } = await supabase
      .from('products')
      .update(cleanData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, product }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};

// --- DELETE: Remover Produto ---
export const onRequestDelete = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    
    if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });

    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Config missing');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};

// CORS Options
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
