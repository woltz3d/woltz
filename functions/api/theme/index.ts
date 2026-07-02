// functions/api/theme/index.ts
import { createClient } from '@supabase/supabase-js';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

export const onRequestOptions = async () => 
  new Response(null, { status: 204, headers: getCorsHeaders() });

export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('theme_settings')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    
    // Transforma array em objeto { key: value }
    const settings: any = {};
    data?.forEach((row: any) => {
      settings[row.key] = row.value;
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: settings 
    }), { 
      status: 200, 
      headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } 
    });
    
  } catch (err: any) {
    console.error('Theme GET error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: getCorsHeaders() 
    });
  }
};

export const onRequestPut = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    const updates = await context.request.json();
    
    // Atualiza múltiplas configurações de uma vez
    const promises = Object.entries(updates).map(async ([key, value]) => {
      const { error } = await supabase
        .from('theme_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);
      
      if (error) throw error;
    });
    
    await Promise.all(promises);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Theme settings updated'
    }), { 
      status: 200, 
      headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } 
    });
    
  } catch (err: any) {
    console.error('Theme PUT error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: getCorsHeaders() 
    });
  }
};
