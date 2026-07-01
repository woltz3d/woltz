// functions/api/products/index.ts
import { createClient } from '@supabase/supabase-js';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

export const onRequestOptions = async () => new Response(null, { status: 204, headers: getCorsHeaders() });

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
    
    // Garante que colors seja sempre um array válido na resposta
    const safeProducts = products?.map(p => ({
      ...p,
      colors: Array.isArray(p.colors) ? p.colors : []
    })) || [];

    return new Response(JSON.stringify({ success: true, data: safeProducts }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: getCorsHeaders() });
  }
};

export const onRequestPost = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    if (!data.id) data.id = crypto.randomUUID();
    if (!data.slug && data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    Object.keys(data).forEach(k => { if (data[k] === "" || data[k] === "null") data[k] = null; });
    if(data.price_brl) data.price_brl = parseFloat(data.price_brl);
    if(data.price_usd) data.price_usd = parseFloat(data.price_usd);
    if(data.net_brl) data.net_brl = parseFloat(data.net_brl);
    
    // Garante que colors seja array
    if (!Array.isArray(data.colors)) data.colors = [];

    const { data: product, error } = await supabase.from('products').insert([data]).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, product }), { status: 201, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  }
};

export const onRequestPut = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID missing');
    
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    const allowed = ['name', 'slug', 'type', 'collection_id', 'description', 'thumbnail_url', 'price_brl', 'price_usd', 'net_brl', 'status', 'colors'];
    const cleanData: any = {};
    allowed.forEach(k => { if (data[k] !== undefined) cleanData[k] = data[k]; });
    
    Object.keys(cleanData).forEach(k => { if (cleanData[k] === "" || cleanData[k] === "null") cleanData[k] = null; });
    if(cleanData.price_brl) cleanData.price_brl = parseFloat(cleanData.price_brl);
    if(cleanData.price_usd) cleanData.price_usd = parseFloat(cleanData.price_usd);
    if(cleanData.net_brl) cleanData.net_brl = parseFloat(cleanData.net_brl);
    
    // Garante que colors seja array antes de salvar
    if (!Array.isArray(cleanData.colors)) cleanData.colors = [];

    const { data: product, error } = await supabase.from('products').update(cleanData).eq('id', id).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, product }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  }
};

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
