import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/initialData';

function socialCardsPlugin(): Plugin {
  return {
    name: 'social-cards-plugin',
    transformIndexHtml(html, ctx) {
      const anyCtx = ctx as {
        server?: { config?: { server?: unknown } };
        originalUrl?: string;
        path?: string;
      };
      const rawUrl = anyCtx.originalUrl || anyCtx.path || '';

      // Determine public base URL (prefer Vercel production domain, then VERCEL_URL, then APP_URL, then live Vercel domain)
      let rawBaseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : (process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : (process.env.APP_URL || 'https://achados-cctech.vercel.app'));

      if (rawBaseUrl.includes('ais-dev-')) {
        rawBaseUrl = 'https://achados-cctech.vercel.app';
      }
      const baseUrl = rawBaseUrl.replace(/\/+$/, '');

      let transformed = html;

      // Check if request is targeting a specific product (e.g. ?p=prod-1 or ?produto=prod-1)
      const match = rawUrl.match(/[?&](?:p|produto)=([a-zA-Z0-9_\-]+)/);
      if (match && match[1]) {
        const prodId = match[1];
        const product = INITIAL_PRODUCTS.find((p) => p.id === prodId);
        if (product) {
          const productTitle = `${product.title} | Ofertas do Dia`;
          const productDesc = product.description 
            ? product.description.slice(0, 160).replace(/"/g, '&quot;')
            : `Confira a oferta oficial de ${product.title} na ${product.store}. Compre com desconto e link verificado!`;
          const rawImg = product.images?.[0] || `${baseUrl}/og-image.jpg`;
          const productImg = rawImg.startsWith('http') 
            ? rawImg 
            : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
          const productShareUrl = `${baseUrl}/?p=${product.id}`;

          transformed = transformed
            .replace(/<title>[\s\S]*?<\/title>/, `<title>${productTitle}</title>`)
            .replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${productShareUrl}" />`)
            .replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${productDesc}" />`)
            .replace(/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${productShareUrl}" />`)
            .replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${productTitle}" />`)
            .replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${productDesc}" />`)
            .replace(/<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${productImg}" />`)
            .replace(/<meta\s+property="og:image:secure_url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image:secure_url" content="${productImg}" />`)
            .replace(/<meta\s+property="og:image:alt"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image:alt" content="${productTitle}" />`)
            .replace(/<link\s+rel="image_src"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="image_src" href="${productImg}" />`)
            .replace(/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:title" content="${productTitle}" />`)
            .replace(/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:description" content="${productDesc}" />`)
            .replace(/<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:image" content="${productImg}" />`)
            .replace(/<meta\s+name="twitter:image:alt"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:image:alt" content="${productTitle}" />`);
        }
      }

      return transformed;
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), socialCardsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
