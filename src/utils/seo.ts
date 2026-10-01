/**
 * SEO & Social Metadata Utility for Achados do Dia
 * Compliant with applet-seo skill and search crawlers (Googlebot, WhatsApp, Facebook, Twitter/X, Telegram)
 */

import { Product } from '../types';

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const DEFAULT_TITLE = 'Achados do Dia – Melhores Ofertas, Cupons e Achadinhos da Internet';
export const DEFAULT_DESCRIPTION = 'Encontre os melhores achadinhos virais, cupons de desconto e promoções oficiais da Shopee, Mercado Livre, Amazon e Shein com links 100% verificados e seguros.';
export const DEFAULT_IMAGE = '/images/banner_achadinhos_virais_1790121462152.jpg';

export function setMetaTag(name: string, content: string, isProperty: boolean = false) {
  if (typeof document === 'undefined') return;

  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    if (isProperty) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  if (typeof window === 'undefined') return pathOrUrl;
  const origin = window.location.origin;
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${cleanPath}`;
}

/**
 * Updates dynamic JSON-LD structured data for Google Search rich snippets
 */
export function updateStructuredData(product?: Product | null) {
  if (typeof document === 'undefined') return;

  const scriptId = 'dynamic-json-ld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-ntmbpov2wv7232nhqojqk2-300468531200.us-east5.run.app';

  if (product) {
    // Rich Product Schema for Google Search Snippets (Price, Stock, Rating, Image)
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title,
      image: (product.images || []).map((img) => toAbsoluteUrl(img)),
      description: product.description || `Oferta especial de ${product.title} na loja oficial ${product.store}.`,
      brand: {
        '@type': 'Brand',
        name: product.store || 'Loja Parceira Oficial',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        url: product.affiliateUrl || origin,
        seller: {
          '@type': 'Organization',
          name: product.store,
        },
      },
      ...(product.rating ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 15,
          bestRating: 5,
          worstRating: 1,
        },
      } : {}),
    };
    script.textContent = JSON.stringify(productSchema);
  } else {
    // WebSite + CollectionPage Schema for Homepage
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: 'Achados do Dia',
          alternateName: ['Achados do Dia - Melhores Ofertas e Promoções', 'Achadinhos Online'],
          description: DEFAULT_DESCRIPTION,
          inLanguage: 'pt-BR',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'CollectionPage',
          '@id': `${origin}/#collection`,
          url: origin,
          name: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          inLanguage: 'pt-BR',
        },
      ],
    };
    script.textContent = JSON.stringify(websiteSchema);
  }
}

export function updatePageSEO(options: SEOOptions, product?: Product | null) {
  if (typeof document === 'undefined') return;

  const title = options.title ? `${options.title}` : DEFAULT_TITLE;
  const description = options.description || DEFAULT_DESCRIPTION;
  const image = toAbsoluteUrl(options.image || DEFAULT_IMAGE);
  const currentUrl = options.url || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');

  // 1. Browser Tab Title
  document.title = title;

  // 2. Standard Search Meta
  setMetaTag('description', description);
  if (currentUrl) {
    setCanonicalUrl(currentUrl);
  }

  // 3. OpenGraph / WhatsApp / Facebook
  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:type', options.type || (product ? 'product' : 'website'), true);
  setMetaTag('og:site_name', 'Achados do Dia', true);
  setMetaTag('og:locale', 'pt_BR', true);

  if (currentUrl) {
    setMetaTag('og:url', currentUrl, true);
  }

  if (image) {
    setMetaTag('og:image', image, true);
    setMetaTag('og:image:secure_url', image, true);
    setMetaTag('og:image:type', 'image/jpeg', true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:image:alt', title, true);

    // Legacy / WhatsApp link rel="image_src" fallback
    let linkImage = document.querySelector('link[rel="image_src"]') as HTMLLinkElement | null;
    if (!linkImage) {
      linkImage = document.createElement('link');
      linkImage.setAttribute('rel', 'image_src');
      document.head.appendChild(linkImage);
    }
    linkImage.setAttribute('href', image);
  }

  // 4. Twitter / X Card
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  if (image) {
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:image:alt', title);
  }

  // 5. Update Dynamic Schema.org JSON-LD
  updateStructuredData(product);
}
