import { Helmet } from 'react-helmet-async';

export const SeoHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://images.unsplash.com/photo-1549557451-b847ae91b107?q=80&w=1200', 
  url = 'https://tudominio.com/',
  schema
}) => {
  const siteTitle = title ? `${title} | AutoLook & MotoLook` : 'AutoLook & MotoLook | Repuestos y Lujos';
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="publisher" content="AutoLook Colombia" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      {description && <meta property="twitter:description" content={description} />}
      <meta property="twitter:image" content={ogImage} />

      {/* JSON-LD Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
