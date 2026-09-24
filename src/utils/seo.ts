/**
 * SEO & Social Metadata Utility for Achados do Dia
 * Compliant with applet-seo skill and social crawlers (WhatsApp, Facebook, Twitter/X, Telegram)
 */

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Achados do Dia - Melhores Ofertas e Achadinhos da Internet';
const DEFAULT_DESCRIPTION = 'Agregador de ofertas e achadinhos das melhores lojas online. Encontre os produtos mais virais e recomendados com links diretos para compra.';
const DEFAULT_IMAGE = '/og-image.jpg';

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

export function updatePageSEO(options: SEOOptions) {
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
  setMetaTag('og:type', options.type || 'website', true);
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
  }

  // 4. Twitter / X Card
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  if (image) {
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:image:alt', title);
  }
}
