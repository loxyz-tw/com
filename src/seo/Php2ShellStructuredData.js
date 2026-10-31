import { CONTENT_UPDATED_AT, NAME_ZH, SITE_URL } from '../data/site';
import {
  PHP2SHELL_DESCRIPTION,
  PHP2SHELL_H1,
  PHP2SHELL_TITLE,
  PHP2SHELL_URL,
  PHP2SHELL_OG_IMAGE,
} from '../data/php2shell';

export default function Php2ShellStructuredData() {
  const orgId = `${SITE_URL}/#organization`;
  const webpageId = `${PHP2SHELL_URL}#webpage`;
  const breadcrumbId = `${PHP2SHELL_URL}#breadcrumb`;
  const serviceId = `${PHP2SHELL_URL}#service`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: NAME_ZH,
      url: `${SITE_URL}/`,
    },
    {
      '@type': 'WebPage',
      '@id': webpageId,
      url: PHP2SHELL_URL,
      name: PHP2SHELL_TITLE,
      description: PHP2SHELL_DESCRIPTION,
      inLanguage: 'zh-TW',
      dateModified: CONTENT_UPDATED_AT,
      breadcrumb: { '@id': breadcrumbId },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: PHP2SHELL_OG_IMAGE,
        contentUrl: PHP2SHELL_OG_IMAGE,
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首頁',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: PHP2SHELL_H1,
          item: PHP2SHELL_URL,
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: PHP2SHELL_H1,
      serviceType: 'Vulnerability Remediation',
      provider: { '@id': orgId },
      url: PHP2SHELL_URL,
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
