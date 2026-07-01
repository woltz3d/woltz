// functions/api/home/index.ts
import { createClient } from '@supabase/supabase-js';

export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);

    // 1. Busca a Coleção Mais Recente (Destaque Principal)
    const { data: latestCollection } = await supabase
      .from('collections')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 2. Busca os Últimos Lançamentos (Produtos ou Coleções Antigas)
    // Lógica: Pega os 6 itens mais recentes (produtos published OU coleções published)
    // Para simplificar agora, vamos pegar os últimos 6 PRODUTOS published que tenham thumbnail
    const { data: recentProducts } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('status', 'published')
      .not('thumbnail_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(6);

    // 3. Calcula preço do pack da coleção destaque (se existir)
    let collectionPackPriceBrl = 0;
    let collectionPackPriceUsd = 0;
    let productCount = 0;

    if (latestCollection) {
      const { data: productsInCol } = await supabase
        .from('products')
        .select('price_brl, price_usd')
        .eq('collection_id', latestCollection.id)
        .eq('status', 'published');

      productCount = productsInCol?.length || 0;
      
      const totalBrl = productsInCol?.reduce((sum, p) => sum + (parseFloat(p.price_brl) || 0), 0) || 0;
      const totalUsd = productsInCol?.reduce((sum, p) => sum + (parseFloat(p.price_usd) || 0), 0) || 0;

      // Aplica desconto de pack (15% off)
      collectionPackPriceBrl = totalBrl > 0 ? totalBrl * 0.85 : 0;
      collectionPackPriceUsd = totalUsd > 0 ? totalUsd * 0.85 : 0;
    }

    return new Response(JSON.stringify({
      success: true,
      featuredCollection: latestCollection ? {
        ...latestCollection,
        pack_price_brl: collectionPackPriceBrl.toFixed(2),
        pack_price_usd: collectionPackPriceUsd.toFixed(2),
        product_count: productCount
      } : null,
      recentItems: recentProducts || []
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
