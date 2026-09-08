import { DataSource } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { View } from '../../projects/entities/view.entity';
import { Improvement } from '../../projects/entities/improvement.entity';

type ProjectSeed = Omit<Project, 'views' | 'improvements'>;

// Views and improvements point at their project by id instead of by object, so
// a project added later can be seeded on its own, without having to wipe a
// database that already holds the earlier ones.
type ViewSeed = Omit<View, 'id' | 'project'> & { projectId: string };
type ImprovementSeed = Omit<Improvement, 'id' | 'project'> & {
  projectId: string;
};

/**
 * Marks an image that has not been uploaded yet. Screenshots live on
 * Cloudinary (see the URLs below), and a project seeded with a placeholder
 * would show up in the portfolio as a broken image, so `seedProjects` skips
 * any project still carrying one.
 */
const IMAGE_TODO_PREFIX = 'TODO://';

/**
 * TODO: upload the wloczkapisane.pl screenshots to Cloudinary and replace
 * every value below with its URL. Until that happens the project is skipped
 * by the seed.
 */
const wloczkapisaneImages = {
  thumbnail: `${IMAGE_TODO_PREFIX}wloczkapisane-home`,
  home: `${IMAGE_TODO_PREFIX}wloczkapisane-home`,
  shop: `${IMAGE_TODO_PREFIX}wloczkapisane-shop`,
  product: `${IMAGE_TODO_PREFIX}wloczkapisane-product`,
  checkout: `${IMAGE_TODO_PREFIX}wloczkapisane-checkout`,
  blog: `${IMAGE_TODO_PREFIX}wloczkapisane-blog`,
};

const projects: ProjectSeed[] = [
  {
    id: 'ecommerce-web-app',
    category: 'react',
    title: 'eCommerce web-app',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994952/ecommerce-home_a6y1rh.png',
    skills: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'React Router',
      'Context API',
      'Responsive Design',
    ],
    details: [
      'An eCommerce app built using React class components',
      'Filtering products by category name (all, clothes, tech).',
      'Ability to add/remove products and change their amounts in the cart.',
      'Ability to change product attributes (color, capacity, size, etc.).',
      'Selected options of added products are visible in both cart overlay and cart page.',
      'Ability to switch between available currencies.',
      'Currency and cart popovers close by clicking outside.',
    ],
    technologies: [
      'React.js: Provides good user experience through Virtual DOM.',
      'Redux Toolkit: Manages the state, preventing props drilling.',
      'React Router DOM: Creates separate URLs for categories and products.',
      'SCSS: Enhances styling capabilities.',
      'GraphQL (Apollo): Fetches data from the API.',
    ],
  },
  {
    id: 'portfolio-website',
    category: 'react',
    title: 'Portfolio website',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769372587/thumbnail-portfolio_u7mrmf.png',
    skills: [
      'React',
      'TypeScript',
      'TailwindCSS',
      'NestJS',
      'PostgreSQL',
      'REST API',
      'Responsive Design',
    ],
    details: [
      'A full-stack portfolio app with a React frontend and a NestJS REST API backend.',
      'Backend serves personal and professional data (experience, projects, skills, certifications) via read-only GET endpoints.',
      'PostgreSQL database hosted on Supabase, managed with TypeORM migrations and seed scripts.',
      'Functional contact form with server-side email delivery via Resend and IP-based rate limiting.',
      'Responsive design built with TailwindCSS, adapting seamlessly across all screen sizes.',
    ],
    technologies: [
      'React.js: Component-based UI with React Router for client-side navigation.',
      'TypeScript: Static typing across both frontend and backend.',
      'TailwindCSS: Utility-first styling for rapid, consistent UI development.',
      'NestJS: Structured backend framework built on Express with dependency injection.',
      'TypeORM: ORM for entity management, migrations, and database seeding.',
      'PostgreSQL / Supabase: Managed relational database with connection pooling.',
      'Resend: Transactional email API for contact form delivery.',
    ],
  },
  {
    id: 'wloczkapisane',
    category: 'react',
    title: 'Włóczką Pisane',
    image: wloczkapisaneImages.thumbnail,
    skills: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Sanity CMS',
      'Stripe',
      'SEO',
      'Responsive Design',
    ],
    details: [
      'A commercial online shop (wloczkapisane.pl) for a handmade crochet business, built with the Next.js App Router and server-side rendering.',
      'Every piece of content - products, categories, blog posts, gallery photos and the shipping banner - is managed by the shop owner in a Sanity Studio embedded at /studio, with no developer involved.',
      'Two-level category tree with multi-select filtering, plus bestseller and new-arrival views, all encoded in shareable Polish URLs.',
      'Cart persisted in localStorage, progress bar towards free delivery, and a per-product made-to-order or sold-out state driven by stock.',
      'Checkout with Stripe Payment Element (cards, BLIK, Przelewy24, Apple/Google Pay) and three delivery options: InPost parcel locker, InPost courier, or personal pickup.',
      'Parcel locker picked on the InPost Geowidget map, with a searchable list backed by a cached proxy of the InPost ShipX API as a fallback when the widget fails to load.',
      'A Stripe webhook confirms the order: it decrements stock in Sanity and sends confirmation emails to both the customer and the shop owner through Resend.',
      'Photo gallery with a lightbox and embedded Instagram posts, plus a blog whose posts are written in the same admin panel.',
      'Landing page telling the story behind the brand: the maker, the creation process, customer testimonials and the newest products.',
      'SEO built in: per-page metadata and canonicals, sitemap, robots.txt, generated Open Graph image and JSON-LD structured data (OnlineStore, Product, BlogPosting, breadcrumbs).',
      'Polish consumer law covered: terms and privacy policy pages, and the withdrawal notice repeated in the confirmation email.',
      'Security headers with a Content-Security-Policy tuned for Stripe 3D Secure, InPost and Instagram, plus IP rate limiting on the checkout endpoint.',
      'Handed over with a Polish, non-technical manual for the shop owner covering the whole admin panel.',
    ],
    technologies: [
      'Next.js (App Router): Server components and incremental static regeneration, so the shop is indexable by Google and fast on first load.',
      'React & TypeScript: Typed component model, with client components only where the UI actually needs interactivity.',
      'Sanity CMS: Headless content platform with an embedded Studio and GROQ queries feeding the shop, blog and gallery.',
      'Tailwind CSS: Utility-first styling of the entire storefront.',
      'Stripe (Payment Element + webhooks): Card and local payment methods, 3D Secure, and server-side order confirmation.',
      'Resend: Transactional emails - order confirmation for the customer, order notification for the owner.',
      'InPost (Geowidget + ShipX API): Parcel locker selection, proxied and cached server-side to keep payloads small.',
      'Railway: Hosting of the production deployment.',
    ],
  },
  {
    id: 'trello-clone',
    category: 'react',
    title: 'Trello Clone',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994963/trello-home_p1j5a7.png',
    skills: [
      'React',
      'TypeScript',
      'SCSS',
      'React Router',
      'Drag and Drop',
      'Responsive Design',
    ],
    details: [
      'A Trello clone built using React functional components.',
      'A responsive design that adapts to various screen sizes.',
      'Drag-and-drop functionality for moving cards between lists.',
      'A clean and modern design that mimics the look and feel of Trello.',
    ],
    technologies: [
      'React.js: Provides good user experience through Virtual DOM.',
      'SCSS: Enhances styling capabilities.',
      'React Router DOM: Creates separate URLs for different sections of the website.',
      'React Beautiful DnD: Implements drag-and-drop functionality.',
    ],
  },
  {
    id: 'marmak',
    category: 'html',
    title: 'MarMak Mechanika',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994957/marmak-home_ibqgmw.png',
    skills: ['HTML', 'CSS', 'SCSS', 'Bootstrap', 'JavaScript'],
    details: [
      'A website for a car mechanic business built using HTML, CSS, and JavaScript.',
      'A clean and professional design that showcases the services offered by the business.',
      'A responsive design that adapts to various screen sizes.',
      'A contact form that allows visitors to get in touch with the business.',
    ],
    technologies: [
      'HTML: Provides the structure of the website.',
      'CSS: Styles the website and makes it visually appealing.',
      'Bootstrap: Provides pre-designed components for faster development.',
      'JavaScript: Adds interactivity and functionality to the website.',
    ],
  },
  {
    id: 'butik',
    category: 'html',
    title: 'Butik Irena',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994915/butik-home_vm9vdy.png',
    skills: ['HTML', 'CSS', 'SCSS', 'Bootstrap', 'JavaScript'],
    details: [
      'A website for a boutique business built using HTML, CSS, and JavaScript.',
      'A clean and modern design that showcases the products offered by the business.',
      'A responsive design that adapts to various screen sizes.',
      'A contact form that allows visitors to get in touch with the business.',
    ],
    technologies: [
      'HTML: Provides the structure of the website.',
      'CSS: Styles the website and makes it visually appealing.',
      'Bootstrap: Provides pre-designed components for faster development.',
      'JavaScript: Adds interactivity and functionality to the website.',
    ],
  },
  {
    id: 'countrypedia',
    category: 'html',
    title: 'CountryPedia',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994950/countrypedia-home_weyfdt.png',
    skills: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
    details: [
      'A website that provides information about countries built using HTML, CSS, and JavaScript.',
      'A clean and modern design that showcases the information about each country.',
      'A responsive design that adapts to various screen sizes.',
      'A search functionality that allows users to find specific countries.',
    ],
    technologies: [
      'HTML: Provides the structure of the website.',
      'CSS: Styles the website and makes it visually appealing.',
      'Bootstrap: Provides pre-designed components for faster development.',
      'JavaScript: Adds interactivity and functionality to the website.',
    ],
  },
];

const views: ViewSeed[] = [
  // Views for eCommerce web app
  {
    projectId: 'ecommerce-web-app',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994952/ecommerce-home_a6y1rh.png',
  },
  {
    projectId: 'ecommerce-web-app',
    title: 'Product Details',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994955/ecommerce-product_yhcasg.png',
  },
  {
    projectId: 'ecommerce-web-app',
    title: 'Cart',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994954/ecommerce-popover_n2wheg.png',
  },
  {
    projectId: 'ecommerce-web-app',
    title: 'Checkout',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994952/ecommerce-cart_dr20mk.png',
  },

  // Views for Portfolio Website
  {
    projectId: 'portfolio-website',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769372587/thumbnail-portfolio_u7mrmf.png',
  },
  {
    projectId: 'portfolio-website',
    title: 'About',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769373429/portfolio-about_rrwqkx.png',
  },
  {
    projectId: 'portfolio-website',
    title: 'Experience',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769374652/portfolio-experience_fomkd4.png',
  },
  {
    projectId: 'portfolio-website',
    title: 'Projects',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769374639/portfolio-projects_zz3oln.png',
  },

  // Views for Włóczką Pisane
  {
    projectId: 'wloczkapisane',
    title: 'Home',
    image: wloczkapisaneImages.home,
  },
  {
    projectId: 'wloczkapisane',
    title: 'Shop',
    image: wloczkapisaneImages.shop,
  },
  {
    projectId: 'wloczkapisane',
    title: 'Product Details',
    image: wloczkapisaneImages.product,
  },
  {
    projectId: 'wloczkapisane',
    title: 'Checkout',
    image: wloczkapisaneImages.checkout,
  },
  {
    projectId: 'wloczkapisane',
    title: 'Blog',
    image: wloczkapisaneImages.blog,
  },

  // Views for Trello Clone
  {
    projectId: 'trello-clone',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994963/trello-home_p1j5a7.png',
  },

  // Views for Marmak
  {
    projectId: 'marmak',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994957/marmak-home_ibqgmw.png',
  },
  {
    projectId: 'marmak',
    title: 'Services',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994959/marmak-offer_ngcfrr.png',
  },
  {
    projectId: 'marmak',
    title: 'Location',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994958/marmak-location_ak5z27.png',
  },
  {
    projectId: 'marmak',
    title: 'Pricing',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994961/marmak-prices_notm4y.png',
  },
  {
    projectId: 'marmak',
    title: 'Gallery',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994956/marmak-gallery_mri2vs.png',
  },

  // Views for Butik
  {
    projectId: 'butik',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994915/butik-home_vm9vdy.png',
  },
  {
    projectId: 'butik',
    title: 'Products',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994913/butik-categories_vuqyyt.png',
  },
  {
    projectId: 'butik',
    title: 'Pricing',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994916/butik-offer_qauds8.png',
  },
  {
    projectId: 'butik',
    title: 'Newsletter',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994914/butik-location_rgou5m.png',
  },
  {
    projectId: 'butik',
    title: 'Contact',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994914/butik-contact_wpp6cy.png',
  },

  // Views for Countrypedia
  {
    projectId: 'countrypedia',
    title: 'Home',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994950/countrypedia-home_weyfdt.png',
  },
  {
    projectId: 'countrypedia',
    title: 'Country Details',
    image:
      'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994949/countrypedia-form_geng5s.png',
  },
];

const improvements: ImprovementSeed[] = [
  {
    projectId: 'ecommerce-web-app',
    improvement: 'TypeScript Migration',
    description:
      'GraphQL Codegen could generate reusable types for the frontend. TypeScript would reduce bugs and provide better autosuggestions.',
  },
  {
    projectId: 'ecommerce-web-app',
    improvement: 'Hooks Refactor',
    description:
      'Migrating from class components to hooks would simplify the codebase and keep it up-to-date with the latest React features.',
  },
  {
    projectId: 'ecommerce-web-app',
    improvement: 'Thumbnail Addition',
    description:
      'Adding product thumbnails in the API ensures the best-looking photo is displayed, improving the overall product presentation.',
  },
  {
    projectId: 'ecommerce-web-app',
    improvement: 'UX Improvements',
    descriptionDetails: [
      'Ability to change attributes in cart popover.',
      'Clickable logo to redirect to the all categories listing page.',
      'Skeleton loaders instead of spinners for a smoother UX.',
      'Toast messages for cart updates (add/increase/decrease).',
      'Display tax in the cart popover, not only in the cart page.',
    ],
  },
  {
    projectId: 'portfolio-website',
    improvement: 'Dark Mode',
    description:
      'Adding a dark mode toggle would let visitors choose their preferred color scheme, improving comfort in low-light environments and aligning with modern UI expectations.',
  },
  {
    projectId: 'portfolio-website',
    improvement: 'Professional UX/UI Review',
    description:
      'Consulting with a professional UX/UI designer could surface usability issues, improve visual hierarchy, and elevate the overall impression, especially important for a portfolio aimed at potential employers.',
  },
  {
    projectId: 'portfolio-website',
    improvement: 'SEO Optimization',
    description:
      'Adding proper meta tags, Open Graph data, and structured markup would improve search engine visibility and make shared links look polished on social media.',
  },
  {
    projectId: 'portfolio-website',
    improvement: 'Accessibility (WCAG)',
    description:
      'Auditing and improving keyboard navigation, ARIA labels, color contrast ratios, and focus management would ensure the site is usable for everyone and demonstrates awareness of accessibility standards.',
  },
  {
    projectId: 'wloczkapisane',
    improvement: 'Orders in a Database',
    description:
      'Stock is verified when checkout starts but only decremented once the Stripe webhook fires, so two customers can buy the last item within the same minute. Moving orders and stock into PostgreSQL with an atomic decrement would close that window and give the owner an order history that does not live only in Stripe and in an inbox.',
  },
  {
    projectId: 'wloczkapisane',
    improvement: 'Webhook Idempotency',
    description:
      'Storing processed Stripe event IDs would stop a retried webhook from sending duplicate confirmation emails after a mid-execution failure.',
  },
  {
    projectId: 'wloczkapisane',
    improvement: 'Automated Shipping Labels',
    description:
      'Shipments are created by hand in the InPost panel today. Generating labels through the ShipX API and mailing the tracking number back to the customer would remove that manual step as order volume grows.',
  },
  {
    projectId: 'wloczkapisane',
    improvement: 'Customer Accounts',
    description:
      'Supabase is already wired in as a placeholder. Using it for accounts would bring order history, saved addresses and a wishlist, turning a one-off purchase into a returning customer.',
  },
  {
    projectId: 'wloczkapisane',
    improvement: 'End-to-End Tests',
    description:
      'The payment path is the part of the shop that must never break. Covering cart, delivery choice and checkout with Playwright would protect it from regressions on every deploy.',
  },
  {
    projectId: 'trello-clone',
    improvement: 'User Authentication',
    description:
      'Adding user authentication would allow users to create accounts, log in, and save their boards and cards.',
  },
  {
    projectId: 'trello-clone',
    improvement: 'Real-Time Updates',
    description:
      'Implementing real-time updates would allow users to see changes made by other users in real time, similar to the actual Trello app.',
  },
  {
    projectId: 'marmak',
    improvement: 'SEO Optimization',
    description:
      'Optimizing the website for search engines would improve its visibility and help attract more visitors.',
  },
  {
    projectId: 'marmak',
    improvement: 'Performance Optimization',
    description:
      'Improving the performance of the website would reduce load times and provide a better user experience.',
  },
  {
    projectId: 'butik',
    improvement: 'SEO Optimization',
    description:
      'Optimizing the website for search engines would improve its visibility and help attract more visitors.',
  },
  {
    projectId: 'butik',
    improvement: 'Performance Optimization',
    description:
      'Improving the performance of the website would reduce load times and provide a better user experience.',
  },
  {
    projectId: 'countrypedia',
    improvement: 'API Integration',
    description:
      'Integrating a RESTful API would allow the website to fetch real-time data about countries, such as population, area, and currency.',
  },
  {
    projectId: 'countrypedia',
    improvement: 'Dynamic Search',
    description:
      'Implementing a dynamic search functionality would allow users to search for countries as they type, providing instant results.',
  },
];

export async function seedProjects(dataSource: DataSource): Promise<void> {
  const projectRepository = dataSource.getRepository(Project);
  const viewRepository = dataSource.getRepository(View);
  const improvementRepository = dataSource.getRepository(Improvement);

  // Checked per project rather than by row count, so a project added to this
  // file later still reaches a database that was seeded before it existed.
  const existing = await projectRepository.find({ select: ['id'] });
  const existingIds = new Set(existing.map((project) => project.id));

  const missing = projects.filter((project) => !existingIds.has(project.id));
  const pending = missing.filter((project) =>
    project.image.startsWith(IMAGE_TODO_PREFIX),
  );
  const ready = missing.filter(
    (project) => !project.image.startsWith(IMAGE_TODO_PREFIX),
  );

  if (pending.length > 0) {
    console.log(
      `⚠ Skipping ${pending
        .map((project) => project.id)
        .join(', ')}: image URLs are still placeholders.`,
    );
  }

  if (ready.length === 0) {
    console.log('✓ Projects data already exists, skipping...');
    return;
  }

  console.log(
    `Seeding projects data (${ready.map((project) => project.id).join(', ')})...`,
  );

  const saved = await projectRepository.save(ready);
  const savedById = new Map(saved.map((project) => [project.id, project]));

  // Only the projects inserted above get their views and improvements: the
  // ones already in the database keep the rows they have.
  await viewRepository.save(
    views
      .filter((view) => savedById.has(view.projectId))
      .map(({ projectId, ...view }) => ({
        ...view,
        project: savedById.get(projectId),
      })),
  );

  await improvementRepository.save(
    improvements
      .filter((improvement) => savedById.has(improvement.projectId))
      .map(({ projectId, ...improvement }) => ({
        ...improvement,
        project: savedById.get(projectId),
      })),
  );

  console.log('✓ Projects data seeded successfully');
}
