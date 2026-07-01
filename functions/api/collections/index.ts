// functions/api/collections/index.ts
import { createClient } from '@supabase/supabase-js';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

export const onRequestOptions = async () => new Response(null, { status: 204, headers: getCorsHeaders() });

// GET: Lista coleções COM CÁLCULOS AUTOMÁTICOS
export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);
    
    // Busca coleções
    const { data: collections, error: colError } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (colError) throw colError;

    // Para cada coleção, busca produtos e calcula totais
    const enrichedCollections = await Promise.all(collections.map(async (col) => {
      const { data: products } = await supabase
        .from('products')
        .select('price_brl, price_usd, net_brl')
        .eq('collection_id', col.id)
        .eq('status', 'published'); // Apenas produtos publicados contam

      const productCount = products?.length || 0;
      
      // Soma dos preços de venda individuais
      const totalSellBrl = products?.reduce((sum, p) => sum + (parseFloat(p.price_brl) || 0), 0) || 0;
      const totalSellUsd = products?.reduce((sum, p) => sum + (parseFloat(p.price_usd) || 0), 0) || 0;
      
      // Soma do líquido desejado (seu salário base)
      const totalNetBrl = products?.reduce((sum, p) => sum + (parseFloat(p.net_brl) || 0), 0) || 0;

      // PREÇO DO PACK: Soma individual com 15% de desconto
      const packPriceBrl = totalSellBrl > 0 ? totalSellBrl * 0.85 : 0;
      const packPriceUsd = totalSellUsd > 0 ? totalSellUsd * 0.85 : 0;

      return {
        ...col,
        product_count: productCount,
        total_sell_brl: totalSellBrl.toFixed(2),
        total_sell_usd: totalSellUsd.toFixed(2),
        pack_price_brl: packPriceBrl.toFixed(2),
        pack_price_usd: packPriceUsd.toFixed(2),
        estimated_net_brl: totalNetBrl.toFixed(2) // Quanto você recebe se vender tudo separado
      };
    }));

    return new Response(JSON.stringify({ success: true, data: enrichedCollections }), { 
      status: 200, 
      headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' } 
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: getCorsHeaders() });
  }
};

// POST, PUT, DELETE permanecem iguais ao código anterior...
// (Mantenha as funções onRequestPost, onRequestPut, onRequestDelete que já funcionam)
export const onRequestPost = async (context: any) => { /* ...código anterior... */ };
export const onRequestPut = async (context: any) => { /* ...código anterior... */ };
export const onRequestDelete = async (context: any) => { /* ...código anterior... */ };
