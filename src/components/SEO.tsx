import React from "react";
import { Helmet } from "react-helmet";

export type SEOProps = {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  jsonLd?: object; // For structured data
};

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url, jsonLd }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    {url && <link rel="canonical" href={url} />}
    {/* Open Graph / Facebook */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    {url && <meta property="og:url" content={url} />}
    <meta property="og:type" content="website" />
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}
    {/* JSON-LD Structured Data */}
    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Helmet>
);

export default SEO; 