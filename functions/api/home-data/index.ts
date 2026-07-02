// functions/api/home-data/index.ts
import { createClient } from '@supabase/supabase-js';

export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);

    // 1. Busca Coleções Published
    const { data: allCols, error: colError } = await supabase
      .from('collections')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (colError) throw colError;

    let featuredCollection: any = null;
    let sidebarCollections: any[] = [];

    if (allCols && allCols.length > 0) {
      const mainCol = allCols[0];
      
      // Calcula preço pack e contagem
      const { data: prods } = await supabase
        .from('products')
        .select('price_brl, price_usd')
        .eq('collection_id', mainCol.id)
        .eq('status', 'published');
      
      const count = prods?.length || 0;
      const totalBrl = prods?.reduce((s: number, p: any) => s + (parseFloat(p.price_brl)||0), 0) || 0;
      const totalUsd = prods?.reduce((s: number, p: any) => s + (parseFloat(p.price_usd)||0), 0) || 0;
      
      featuredCollection = {
        ...mainCol,
        product_count: count,
        pack_price_brl: (totalBrl * 0.85).toFixed(2),
        pack_price_usd: (totalUsd * 0.85).toFixed(2)
      };

      sidebarCollections = allCols.slice(1, 3);
    }

    // 2. Busca Produtos Recentes
    const { data: recentProds, error: prodError } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('status', 'published')
      .not('thumbnail_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(9);

    if (prodError) throw prodError;

    // Remove duplicatas
    const seenNames = new Set();
    const gridProducts = (recentProds || []).filter((p: any) => {
      if (seenNames.has(p.name)) return false;
      seenNames.add(p.name);
      return true;
    }).slice(0, 9);

    return new Response(JSON.stringify({
      success: true,
      featuredCollection,
      sidebarCollections,
      gridProducts
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err: any) {
    console.error('Home Data Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
