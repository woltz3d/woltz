// functions/api/home-data/index.ts
import { createClient } from '@supabase/supabase-js';

export const onRequestGet = async (context: any) => {
  try {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_ANON_KEY);

    // 1. Busca TODAS as Coleções Published ordenadas por data
    const { data: allCols, error: colError } = await supabase
      .from('collections')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (colError) throw colError;

    let featuredCollection: any = null;
    let sidebarCollections: any[] = [];

    // Função auxiliar para calcular dados de uma coleção
    const calculateCollectionData = async (col: any) => {
      const { data: prods } = await supabase
        .from('products')
        .select('price_brl, price_usd, net_brl')
        .eq('collection_id', col.id)
        .eq('status', 'published');
      
      const count = prods?.length || 0;
      const totalBrl = prods?.reduce((s: number, p: any) => s + (parseFloat(p.price_brl)||0), 0) || 0;
      const totalUsd = prods?.reduce((s: number, p: any) => s + (parseFloat(p.price_usd)||0), 0) || 0;
      const estNet = prods?.reduce((s: number, p: any) => s + (parseFloat(p.net_brl)||0), 0) || 0;
      
      return {
        ...col,
        product_count: count,
        pack_price_brl: (totalBrl * 0.85).toFixed(2),
        pack_price_usd: (totalUsd * 0.85).toFixed(2),
        estimated_net_brl: estNet.toFixed(2)
      };
    };

    if (allCols && allCols.length > 0) {
      // Calcula dados da coleção destaque (a mais recente)
      featuredCollection = await calculateCollectionData(allCols[0]);
      
      // Calcula dados das coleções laterais (próximas 2)
      for (let i = 1; i < Math.min(allCols.length, 3); i++) {
        sidebarCollections.push(await calculateCollectionData(allCols[i]));
      }
    }

    // 2. Busca Produtos APENAS da Coleção Mais Recente (NEW COLLECTION)
    // Se não houver coleção destaque, retorna array vazio
    let gridProducts: any[] = [];
    
    if (featuredCollection) {
      const { data: recentProds, error: prodError } = await supabase
        .from('products')
        .select('*, collections(name)')
        .eq('collection_id', featuredCollection.id) // FILTRO CRUCIAL AQUI
        .eq('status', 'published')
        .not('thumbnail_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(9);

      if (!prodError && recentProds) {
        // Remove duplicatas por nome (caso existam variantes)
        const seenNames = new Set();
        gridProducts = recentProds.filter((p: any) => {
          if (seenNames.has(p.name)) return false;
          seenNames.add(p.name);
          return true;
        });
      }
    }

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
