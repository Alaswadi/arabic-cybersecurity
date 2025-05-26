import Script from 'next/script'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization structured data
export function OrganizationStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Phish Simulator",
    "alternateName": "محاكي التصيد الاحتيالي",
    "url": "https://phishsimulator.com",
    "logo": "https://phishsimulator.com/phishsim_logo.png",
    "description": "شركة متخصصة في خدمات الأمن السيبراني وحماية المؤسسات من هجمات التصيد الاحتيالي والتهديدات الرقمية",
    "foundingDate": "2023",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-XX-XXX-XXXX",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "الرياض"
    },
    "sameAs": [
      "https://twitter.com/phishsimulator",
      "https://linkedin.com/company/phishsimulator"
    ],
    "serviceArea": {
      "@type": "Place",
      "name": "المملكة العربية السعودية"
    }
  }

  return <StructuredData data={organizationData} />
}

// Website structured data
export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Phish Simulator",
    "alternateName": "محاكي التصيد الاحتيالي",
    "url": "https://phishsimulator.com",
    "description": "منصة متخصصة في خدمات الأمن السيبراني وحماية المؤسسات من هجمات التصيد الاحتيالي",
    "inLanguage": "ar",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://phishsimulator.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return <StructuredData data={websiteData} />
}

// Service structured data
export function ServiceStructuredData({ 
  name, 
  description, 
  url, 
  image 
}: {
  name: string
  description: string
  url: string
  image?: string
}) {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "provider": {
      "@type": "Organization",
      "name": "Phish Simulator",
      "url": "https://phishsimulator.com"
    },
    "serviceType": "خدمات الأمن السيبراني",
    "category": "الأمن السيبراني",
    "areaServed": {
      "@type": "Country",
      "name": "المملكة العربية السعودية"
    },
    ...(image && { "image": image })
  }

  return <StructuredData data={serviceData} />
}

// Article structured data for blog posts
export function ArticleStructuredData({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = "Phish Simulator Team"
}: {
  headline: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
}) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://phishsimulator.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Phish Simulator",
      "logo": {
        "@type": "ImageObject",
        "url": "https://phishsimulator.com/phishsim_logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "inLanguage": "ar",
    ...(image && { 
      "image": {
        "@type": "ImageObject",
        "url": image,
        "width": 1200,
        "height": 630
      }
    }),
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified && { "dateModified": dateModified })
  }

  return <StructuredData data={articleData} />
}

// FAQ structured data
export function FAQStructuredData({ faqs }: { 
  faqs: Array<{ question: string; answer: string }> 
}) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return <StructuredData data={faqData} />
}
