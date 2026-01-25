import { DataSource } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { View } from '../../projects/entities/view.entity';
import { Improvement } from '../../projects/entities/improvement.entity';

export async function seedProjects(dataSource: DataSource): Promise<void> {
  const projectRepository = dataSource.getRepository(Project);
  const viewRepository = dataSource.getRepository(View);
  const improvementRepository = dataSource.getRepository(Improvement);

  // Check if data already exists
  const count = await projectRepository.count();
  if (count > 0) {
    console.log('✓ Projects data already exists, skipping...');
    return;
  }

  console.log('Seeding projects data...');

  // Insert Projects (Project uses @PrimaryColumn with string IDs)
  const projects = await projectRepository.save([
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
        'SCSS',
        'React Router',
        'Responsive Design',
      ],
      details: [
        'A portfolio website built using React functional components.',
        'A responsive design that adapts to various screen sizes.',
        'A clean and modern design that showcases my skills and experience.',
        'A user-friendly interface that allows visitors to navigate easily.',
      ],
      technologies: [
        'React.js: Provides good user experience through Virtual DOM.',
        'SCSS: Enhances styling capabilities.',
        'React Router DOM: Creates separate URLs for different sections of the website.',
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
  ]);

  const [
    ecommerceWebApp,
    portfolioWebsite,
    trelloClone,
    marmak,
    butik,
    countrypedia,
  ] = projects;

  // Insert Views for each project
  await viewRepository.save([
    // Views for eCommerce web app
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994952/ecommerce-home_a6y1rh.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Product Details',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994955/ecommerce-product_yhcasg.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Cart',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994954/ecommerce-popover_n2wheg.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Checkout',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994952/ecommerce-cart_dr20mk.png',
      project: ecommerceWebApp,
    },

    // Views for Portfolio Website
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769372587/thumbnail-portfolio_u7mrmf.png',
      project: portfolioWebsite,
    },
    {
      title: 'About',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769373429/portfolio-about_rrwqkx.png',
      project: portfolioWebsite,
    },
    {
      title: 'Experience',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769374652/portfolio-experience_fomkd4.png',
      project: portfolioWebsite,
    },
    {
      title: 'Projects',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1769374639/portfolio-projects_zz3oln.png',
      project: portfolioWebsite,
    },

    // Views for Trello Clone
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994963/trello-home_p1j5a7.png',
      project: trelloClone,
    },

    // Views for Marmak
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994957/marmak-home_ibqgmw.png',
      project: marmak,
    },
    {
      title: 'Services',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994959/marmak-offer_ngcfrr.png',
      project: marmak,
    },
    {
      title: 'Location',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994958/marmak-location_ak5z27.png',
      project: marmak,
    },
    {
      title: 'Pricing',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994961/marmak-prices_notm4y.png',
      project: marmak,
    },
    {
      title: 'Gallery',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994956/marmak-gallery_mri2vs.png',
      project: marmak,
    },

    // Views for Butik
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994915/butik-home_vm9vdy.png',
      project: butik,
    },
    {
      title: 'Products',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994913/butik-categories_vuqyyt.png',
      project: butik,
    },
    {
      title: 'Pricing',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994916/butik-offer_qauds8.png',
      project: butik,
    },
    {
      title: 'Newsletter',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994914/butik-location_rgou5m.png',
      project: butik,
    },
    {
      title: 'Contact',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994914/butik-contact_wpp6cy.png',
      project: butik,
    },

    // Views for Countrypedia
    {
      title: 'Home',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994950/countrypedia-home_weyfdt.png',
      project: countrypedia,
    },
    {
      title: 'Country Details',
      image:
        'https://res.cloudinary.com/dwwjjyizc/image/upload/v1767994949/countrypedia-form_geng5s.png',
      project: countrypedia,
    },
  ]);

  // Insert Improvements for each project
  await improvementRepository.save([
    {
      improvement: 'TypeScript Migration',
      description:
        'GraphQL Codegen could generate reusable types for the frontend. TypeScript would reduce bugs and provide better autosuggestions.',
      project: ecommerceWebApp,
    },
    {
      improvement: 'Hooks Refactor',
      description:
        'Migrating from class components to hooks would simplify the codebase and keep it up-to-date with the latest React features.',
      project: ecommerceWebApp,
    },
    {
      improvement: 'Thumbnail Addition',
      description:
        'Adding product thumbnails in the API ensures the best-looking photo is displayed, improving the overall product presentation.',
      project: ecommerceWebApp,
    },
    {
      improvement: 'UX Improvements',
      descriptionDetails: [
        'Ability to change attributes in cart popover.',
        'Clickable logo to redirect to the all categories listing page.',
        'Skeleton loaders instead of spinners for a smoother UX.',
        'Toast messages for cart updates (add/increase/decrease).',
        'Display tax in the cart popover, not only in the cart page.',
      ],
      project: ecommerceWebApp,
    },
    {
      improvement: 'Dark Mode',
      description:
        'Adding a dark mode feature would provide users with an alternative color scheme that is easier on the eyes, especially in low-light environments.',
      project: portfolioWebsite,
    },
    {
      improvement: 'Contact Form',
      description:
        'Implementing a contact form would allow visitors to get in touch with me directly through the website, making it easier to connect.',
      project: portfolioWebsite,
    },
    {
      improvement: 'Animations',
      description:
        'Adding subtle animations to the website would enhance the user experience and make the site more engaging.',
      project: portfolioWebsite,
    },
    {
      improvement: 'SEO Optimization',
      description:
        'Optimizing the website for search engines would improve its visibility and help attract more visitors.',
      project: portfolioWebsite,
    },
    {
      improvement: 'User Authentication',
      description:
        'Adding user authentication would allow users to create accounts, log in, and save their boards and cards.',
      project: trelloClone,
    },
    {
      improvement: 'Real-Time Updates',
      description:
        'Implementing real-time updates would allow users to see changes made by other users in real time, similar to the actual Trello app.',
      project: trelloClone,
    },
    {
      improvement: 'SEO Optimization',
      description:
        'Optimizing the website for search engines would improve its visibility and help attract more visitors.',
      project: marmak,
    },
    {
      improvement: 'Performance Optimization',
      description:
        'Improving the performance of the website would reduce load times and provide a better user experience.',
      project: marmak,
    },
    {
      improvement: 'SEO Optimization',
      description:
        'Optimizing the website for search engines would improve its visibility and help attract more visitors.',
      project: butik,
    },
    {
      improvement: 'Performance Optimization',
      description:
        'Improving the performance of the website would reduce load times and provide a better user experience.',
      project: butik,
    },
    {
      improvement: 'API Integration',
      description:
        'Integrating a RESTful API would allow the website to fetch real-time data about countries, such as population, area, and currency.',
      project: countrypedia,
    },
    {
      improvement: 'Dynamic Search',
      description:
        'Implementing a dynamic search functionality would allow users to search for countries as they type, providing instant results.',
      project: countrypedia,
    },
  ]);

  console.log('✓ Projects data seeded successfully');
}
