/* Privacy Policy and Terms & Conditions copy.
   Written to match what the site actually does today: the enquiry form opens
   the visitor's own email app (nothing is stored on a server), there are no
   analytics or tracking cookies, the Contact map is a Google Maps embed, and
   product videos load from youtube-nocookie.com only when played.
   If any of that changes (a form backend, analytics, online ordering), update
   the matching section and the UPDATED date.

   Body blocks: a string is a paragraph; { list: [...] } is a bullet list. */

export const UPDATED = '22 November 2026'

export const CONTACT = {
  company: 'MV Dugar Group',
  role: 'authorised distributor of BKT tyres in Nepal',
  address: 'Balaju Industrial District, Kathmandu, Nepal',
  email: 'bktservice@mvdugar.com',
  phones: '9802780690 / 9802952894',
}

export const privacy = {
  slug: 'privacy-policy',
  kicker: 'Legal',
  title: 'Privacy Policy',
  intro:
    'What we collect when you use this website or contact us, why we collect it, and what you can ask us to do with it.',
  highlights: [
    { title: 'Only what you give us', text: 'Browse freely — we only see details you send in an enquiry.' },
    { title: 'Never sold', text: 'Your details are used to answer you, supply tyres and handle warranty.' },
    { title: 'No tracking cookies', text: 'No analytics or advertising cookies follow you around the site.' },
  ],
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: [
        `This website is run by ${CONTACT.company}, ${CONTACT.role}, from ${CONTACT.address}. In this policy, “we”, “us” and “our” mean ${CONTACT.company}.`,
        'This policy covers the website and any enquiry you send us through it, by phone or by email.',
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      body: [
        'We only collect what you choose to give us. When you send an enquiry, that is usually:',
        {
          list: [
            'your name;',
            'your email address and, if you add it, your phone number;',
            'the type of enquiry and your message — for example the machine, tyre size or quantity you are asking about.',
          ],
        },
        'If you buy from us or make a warranty claim, we also keep the details needed for that sale or claim, such as your invoice, the tyres supplied and, for a claim, photos and a description of the tyre.',
        'You can browse the whole website without giving us any personal details.',
      ],
    },
    {
      id: 'enquiry-form',
      title: 'How the enquiry form works',
      body: [
        'The form on our Contact page does not send your details to a server. When you press send, it opens a ready-written email in your own email app, addressed to us. Nothing is stored until you choose to send that email.',
      ],
    },
    {
      id: 'how-we-use-it',
      title: 'How we use your information',
      body: [
        'We use your details only to:',
        {
          list: [
            'reply to your enquiry and give you sizing advice or a quote;',
            'supply tyres you order and arrange delivery;',
            'handle warranty claims with you and with BKT;',
            'keep the sales and tax records the law requires.',
          ],
        },
        'We will not send you marketing messages unless you have asked us to, and you can ask us to stop at any time.',
      ],
    },
    {
      id: 'sharing',
      title: 'Who we share it with',
      body: [
        'We do not sell or rent your personal information. We only share it when we need to:',
        {
          list: [
            'with BKT, when a warranty claim needs the manufacturer to assess it;',
            'with a transport or courier company, so they can deliver your order;',
            'with our authorised dealers, if you ask to be put in touch with one near you;',
            'with government authorities, when the law requires it.',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and third-party content',
      body: [
        'This website does not use analytics or advertising cookies, and it does not track you from page to page.',
        'Two pages show content from other companies, which have their own privacy policies:',
        {
          list: [
            'the map on our Contact page is provided by Google Maps;',
            'product videos are hosted on YouTube in privacy-enhanced mode, and only load when you press play.',
          ],
        },
      ],
    },
    {
      id: 'keeping-it',
      title: 'How long we keep it',
      body: [
        'We keep enquiry emails for as long as we need them to deal with your enquiry and any follow-up. Sales, invoice and warranty records are kept for as long as Nepal’s tax and business laws require. After that we delete them.',
        'We keep your information on accounts and devices that only our staff can access.',
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      body: [
        'Under the laws of Nepal, including the Individual Privacy Act, 2075 (2018), you can ask us to:',
        {
          list: [
            'tell you what personal information we hold about you;',
            'correct anything that is wrong;',
            'delete your information, where we do not need to keep it by law;',
            'stop contacting you.',
          ],
        },
        `To do any of this, email ${CONTACT.email} or call ${CONTACT.phones}. We will reply as soon as we can.`,
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: [
        'If we change how we handle your information, we will update this page and the date at the top.',
      ],
    },
  ],
}

export const terms = {
  slug: 'terms',
  kicker: 'Legal',
  title: 'Terms & Conditions',
  intro:
    'The terms for using this website and for buying BKT tyres from us. Please read them before you place an order — if anything is unclear, ask us first.',
  highlights: [
    { title: 'Genuine BKT, full warranty', text: 'Manufacturing defects are covered by BKT’s warranty, honoured by us.' },
    { title: 'Prices by quotation', text: 'Prices and stock are confirmed in writing, in Nepali rupees.' },
    { title: 'Sizing checked first', text: 'We confirm the right size and fitment for your machine before you buy.' },
  ],
  sections: [
    {
      id: 'about-these-terms',
      title: 'About these terms',
      body: [
        `These terms apply to this website and to tyres supplied by ${CONTACT.company}, ${CONTACT.role} (“we”, “us”). By using the website or ordering from us, you agree to them.`,
        'A written quotation or invoice from us may add terms for a particular order. If it differs from this page, the quotation or invoice applies.',
      ],
    },
    {
      id: 'website-information',
      title: 'Information on this website',
      body: [
        'Product details, sizes, photos and specifications on this website are for general guidance. They come from BKT’s published information and may change without notice. Photos may not show the exact tyre supplied.',
        'Always check that a tyre suits your machine, load and use before you buy. We are happy to confirm sizing and fitment for you.',
        'Prices and stock are not shown on the website and are only confirmed in a quotation from us.',
      ],
    },
    {
      id: 'quotes-orders',
      title: 'Quotes and orders',
      body: [
        {
          list: [
            'A quotation is valid for the period written on it. If none is given, please check with us before ordering, as prices and stock can change.',
            'An order is accepted only when we confirm it in writing or by invoice.',
            'All orders depend on stock being available. If we cannot supply an item, we will tell you and refund anything you have paid for it.',
          ],
        },
      ],
    },
    {
      id: 'prices-payment',
      title: 'Prices and payment',
      body: [
        'Prices are in Nepali rupees and include taxes where stated on the quotation. Payment terms are as agreed on your quotation or invoice. Ownership of the tyres passes to you once we receive full payment.',
      ],
    },
    {
      id: 'delivery',
      title: 'Delivery and collection',
      body: [
        'You can collect from our showrooms in Kathmandu and Birgunj, or we can arrange delivery. Delivery times we give are estimates. Please check the tyres when they arrive and tell us as soon as possible about any damage in transit or anything missing.',
      ],
    },
    {
      id: 'warranty',
      title: 'Warranty',
      body: [
        'Every tyre we sell is genuine BKT and comes with the BKT manufacturer warranty, which we honour in full. To make a claim, contact us with your invoice and the tyre. We will inspect it and, where needed, send it to BKT for assessment.',
        'The warranty covers manufacturing defects. It does not cover:',
        {
          list: [
            'normal wear and tear;',
            'damage from road or site hazards, accidents or misuse;',
            'wrong fitting, wrong inflation pressure, overloading, or use on the wrong machine or application;',
            'tyres that have been repaired or altered by someone else.',
          ],
        },
      ],
    },
    {
      id: 'returns',
      title: 'Returns',
      body: [
        'Please contact us before returning any tyre. Returns of unused tyres are only accepted by agreement with us. Tyres that have been fitted or used are covered only under the warranty.',
        'Your rights under the Consumer Protection Act, 2075 (2018) are not affected by these terms.',
      ],
    },
    {
      id: 'liability',
      title: 'Our liability',
      body: [
        'As far as the law allows, we are not responsible for indirect losses such as lost earnings or downtime, and our total liability for any order is limited to the price paid for that order. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      id: 'trademarks',
      title: 'Trademarks and content',
      body: [
        'BKT and the BKT logo are trademarks of Balkrishna Industries Limited and are used here as its authorised distributor. The rest of this website’s content belongs to us. Please do not copy it for commercial use without our permission.',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      body: [
        'These terms are governed by the laws of Nepal. Any dispute will be handled by the courts of Kathmandu.',
      ],
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The version on this page on the date of your order is the one that applies to it.',
      ],
    },
  ],
}
