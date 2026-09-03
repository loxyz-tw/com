import {
  SITE_URL,
  NAME_ZH,
  ALTERNATE_NAME,
  EMAIL,
  ADDRESS,
  CONTENT_UPDATED_AT,
  SERVICES,
  KNOWS_ABOUT,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from '../data/site';
import { PROJECTS } from '../data/projects';
import { FAQS } from '../data/faqs';

export default function StructuredData() {
  const orgId = `${SITE_URL}/#organization`;
  const logoId = `${SITE_URL}/#logo`;
  const websiteId = `${SITE_URL}/#website`;
  const webpageId = `${SITE_URL}/#webpage`;
  const portfolioId = `${SITE_URL}/#portfolio`;
  const faqId = `${SITE_URL}/#faq`;
  const ogImage = `${SITE_URL}/og-image.png`;
  const logoUrl = `${SITE_URL}/logo512-v2.png`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: NAME_ZH,
      alternateName: ALTERNATE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': logoId,
        url: logoUrl,
        contentUrl: logoUrl,
        width: 512,
        height: 512,
      },
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADDRESS.streetAddress,
        addressLocality: ADDRESS.addressLocality,
        addressRegion: ADDRESS.addressRegion,
        addressCountry: ADDRESS.addressCountry,
      },
      knowsAbout: KNOWS_ABOUT,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: NAME_ZH,
      url: `${SITE_URL}/`,
      inLanguage: 'zh-TW',
      publisher: { '@id': orgId },
    },
    {
      '@type': 'WebPage',
      '@id': webpageId,
      url: `${SITE_URL}/`,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { '@id': websiteId },
      about: { '@id': orgId },
      inLanguage: 'zh-TW',
      dateModified: CONTENT_UPDATED_AT,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ogImage,
        contentUrl: ogImage,
        width: 1200,
        height: 630,
      },
    },
    ...SERVICES.map((service) => ({
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-${service.slug}`,
      serviceType: service.serviceType,
      name: service.name,
      description: service.description,
      provider: { '@id': orgId },
      url: `${SITE_URL}/#services`,
    })),
    {
      '@type': 'ItemList',
      '@id': portfolioId,
      itemListElement: PROJECTS.map((project, index) => {
        const item = {
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}/#project-${project.anchor}`,
          name: project.title,
          description: project.description,
          url: project.links[0].url,
          creator: { '@id': orgId },
          keywords: project.technologies.join(','),
        };
        if (project.links[1]) {
          item.sameAs = project.links[1].url;
        }
        return {
          '@type': 'ListItem',
          position: index + 1,
          item,
        };
      }),
    },
    {
      '@type': 'FAQPage',
      '@id': faqId,
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ];

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
