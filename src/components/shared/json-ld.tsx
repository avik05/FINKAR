import React from "react";
import Script from "next/script";

/**
 * SEO Structured Data (JSON-LD)
 * This component provides Google with semantic information about the application,
 * generating "Rich Results" like FAQ dropdowns and App Snippets in search results.
 */
export function JsonLd() {
  const baseUrl = "https://getfinkar.com";
  
  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Finkar",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "founder": {
      "@type": "Person",
      "name": "Avik Majumdar"
    },
    "sameAs": [
      "https://www.linkedin.com/in/avik0508",
      "https://www.instagram.com/aviiiiiiik"
    ]
  };

  // 2. SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Finkar",
    "operatingSystem": "Web, iOS, Android (PWA)",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Finkar is your personal financial command center that helps you track your money, investments, and goals in one place.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "120"
    }
  };

  // 3. FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Finkar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finkar is your personal financial command center that helps you track your money, investments, and goals in one place."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to pay to use Finkar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finkar currently offers core features for free. Future premium features may be introduced."
        }
      },
      {
        "@type": "Question",
        "name": "Is my financial data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Finkar uses secure authentication, database-level access control (RLS), and email verification to protect your data."
        }
      },
      {
        "@type": "Question",
        "name": "Can I track stocks and mutual funds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can manually add your holdings or import XLSX files from brokers like Groww to track them inside your dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a mobile app available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finkar is built as a highly-optimized Progressive Web App (PWA). You can 'Add to Home Screen' on your iPhone or Android device for a native-like experience."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
