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

      let transformed = html;

      // Check if request is targeting a specific product (e.g. ?p=prod-1 or ?produto=prod-1)
      const match = rawUrl.match(/[?&](?:p|produto)=([a-zA-Z0-9_\-]+)/);
      if (match && match[1]) {
        const prodId = match[1];
        const product = INITIAL_PRODUCTS.find((p) => p.id === prodId);
        if (product) {
          const productTitle = `${product.title} | Ofertas do Dia`;
          const productDesc = product.description 
            ? product.description.slice(0, 160)
            : `Confira a oferta oficial de ${product.title} na ${product.store}. Compre com desconto e link verificado!`;
          const rawImg = product.images?.[0] || 'https://ais-pre-mxisftm3n2mcjzjl26bz2d-457784679767.us-east5.run.app/og-image.jpg';
          const productImg = rawImg.startsWith('http') 
            ? rawImg 
            : `https://ais-pre-mxisftm3n2mcjzjl26bz2d-457784679767.us-east5.run.app${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

          transformed = transformed
            .replace(/<title>.*?<\/title>/, `<title>${productTitle}</title>`)
            .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${productDesc}" />`)
            .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${productTitle}" />`)
            .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${productDesc}" />`)
            .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${productImg}" />`)
            .replace(/<meta property="og:image:secure_url" content=".*?" \/>/, `<meta property="og:image:secure_url" content="${productImg}" />`)
            .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${productTitle}" />`)
            .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${productDesc}" />`)
            .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${productImg}" />`)
            .replace(/<link rel="image_src" href=".*?" \/>/, `<link rel="image_src" href="${productImg}" />`);
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
