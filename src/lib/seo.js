/**
 * SEO Helper Functions
 */

/**
 * Generate metadata for pages
 */
export function generateMetadata({
  title,
  description,
  url,
  image,
  keywords,
  type = 'website',
}) {
  const siteName = 'Beyos Clothing';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    'Shop premium fashion and clothing at Beyos Clothing. Discover the latest trends in luxury apparel.';
  const metaDescription = description || defaultDescription;
  const defaultImage = '/images/og-image.jpg';
  const metaImage = image || defaultImage;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords || [
      'fashion',
      'clothing',
      'e-commerce',
      'luxury apparel',
      'online shopping',
    ],
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: url || 'https://beyosclothing.com',
      siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate product schema for SEO
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Beyos Clothing',
    },
    offers: {
      '@type': 'Offer',
      url: `https://beyosclothing.com/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Beyos Clothing',
    url: 'https://beyosclothing.com',
    logo: 'https://beyosclothing.com/images/logo.png',
    sameAs: [
      'https://www.facebook.com/beyosclothing',
      'https://www.instagram.com/beyosclothing',
      'https://twitter.com/beyosclothing',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  };
}
