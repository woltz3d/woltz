// functions/api/products.ts
import { createClient } from '@supabase/supabase-js';

export const onRequestPost: PagesFunction = async (context) => {
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase config missing' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const data = await context.request.json();

    // Gera slug automático se necessário
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([data])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
