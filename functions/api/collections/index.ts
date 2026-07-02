// functions/api/collections/index.ts
import { createClient } from '@supabase/supabase-js';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

export const onRequestOptions = async () => new Response(null, { status: 204, headers: getCorsHeaders() });

export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('GET Collections Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: getCorsHeaders() });
  }
};

export const onRequestPost = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    if (!data.id) data.id = crypto.randomUUID();
    if (!data.slug && data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Limpeza de dados vazios
    Object.keys(data).forEach(k => { 
      if (data[k] === "" || data[k] === "null" || data[k] === undefined) data[k] = null; 
    });

    const { data: collection, error } = await supabase.from('collections').insert([data]).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, collection }), { status: 201, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('POST Collection Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: getCorsHeaders() });
  }
};

export const onRequestPut = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID missing');
    
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    let data = await context.request.json();
    
    // Campos permitidos para update (evita enviar campos read-only como created_at)
    const allowed = ['name', 'slug', 'description', 'category', 'image_url', 'banner_url', 'status'];
    const cleanData: any = {};
    allowed.forEach(k => { 
      if (data[k] !== undefined) {
        cleanData[k] = (data[k] === "" || data[k] === "null") ? null : data[k];
      }
    });

    const { data: collection, error } = await supabase.from('collections').update(cleanData).eq('id', id).select().single();
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true, collection }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('PUT Collection Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: getCorsHeaders() });
  }
};

export const onRequestDelete = async (context: any) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID missing');
    
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('DELETE Collection Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: getCorsHeaders() });
  }
};
