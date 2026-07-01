// functions/api/products/index.ts
import { createClient } from '@supabase/supabase-js';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

export const onRequestOptions = async () => new Response(null, { status: 204, headers: getCorsHeaders() });

// GET: Lista produtos OU coleções (para dropdown)
export const onRequestGet = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const type = url.searchParams.get('type');
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);

    if (type === 'collections') {
      const { data, error } = await supabase.from('collections').select('id, name').eq('status', 'published').order('name');
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
    }

    const { data: products, error } = await supabase.from('products').select('*, collections(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data: products }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: getCorsHeaders() });
  }
};

// POST: Criar Produto
export const onRequestPost = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    if (!data.id) data.id = crypto.randomUUID();
    if (!data.slug && data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Limpeza e conversão de tipos
    Object.keys(data).forEach(k => { if (data[k] === "" || data[k] === "null") data[k] = null; });
    if(data.price_brl) data.price_brl = parseFloat(data.price_brl);
    if(data.price_usd) data.price_usd = parseFloat(data.price_usd);
    if(data.net_brl) data.net_brl = parseFloat(data.net_brl);

    const { data: product, error } = await supabase.from('products').insert([data]).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, product }), { status: 201, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  }
};

// PUT: Editar Produto
export const onRequestPut = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID missing');
    
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    const allowed = ['name', 'slug', 'type', 'collection_id', 'description', 'thumbnail_url', 'price_brl', 'price_usd', 'net_brl', 'status'];
    const cleanData: any = {};
    allowed.forEach(k => { if (data[k] !== undefined) cleanData[k] = data[k]; });
    
    Object.keys(cleanData).forEach(k => { if (cleanData[k] === "" || cleanData[k] === "null") cleanData[k] = null; });
    if(cleanData.price_brl) cleanData.price_brl = parseFloat(cleanData.price_brl);
    if(cleanData.price_usd) cleanData.price_usd = parseFloat(cleanData.price_usd);
    if(cleanData.net_brl) cleanData.net_brl = parseFloat(cleanData.net_brl);

    const { data: product, error } = await supabase.from('products').update(cleanData).eq('id', id).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, product }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  }
};

// DELETE: Remover Produto
export const onRequestDelete = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID missing');
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  }
};
