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
      image: 'ecommerce-home.png',
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
      image: 'portfolio-home.png',
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
      image: 'trello-clone.png',
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
      title: 'MarMak Mechanika Samochodowa',
      image: 'marmak-home.png',
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
      image: 'butik-home.png',
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
      image: 'countrypedia-home.png',
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
      image: 'ecommerce-home.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Product Details',
      image: 'ecommerce-product-details.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Cart',
      image: 'ecommerce-cart.png',
      project: ecommerceWebApp,
    },
    {
      title: 'Checkout',
      image: 'ecommerce-checkout.png',
      project: ecommerceWebApp,
    },

    // Views for Portfolio Website
    {
      title: 'Home',
      image: 'portfolio-home.png',
      project: portfolioWebsite,
    },
    {
      title: 'About',
      image: 'portfolio-about.png',
      project: portfolioWebsite,
    },
    {
      title: 'Experience',
      image: 'portfolio-experience.png',
      project: portfolioWebsite,
    },
    {
      title: 'Projects',
      image: 'portfolio-projects.png',
      project: portfolioWebsite,
    },

    // Views for Trello Clone
    {
      title: 'Home',
      image: 'trello-home.png',
      project: trelloClone,
    },

    // Views for Marmak
    {
      title: 'Home',
      image: 'marmak-home.png',
      project: marmak,
    },
    {
      title: 'Services',
      image: 'marmak-services.png',
      project: marmak,
    },
    {
      title: 'Contact',
      image: 'marmak-contact.png',
      project: marmak,
    },

    // Views for Butik
    {
      title: 'Home',
      image: 'butik-home.png',
      project: butik,
    },
    {
      title: 'Products',
      image: 'butik-products.png',
      project: butik,
    },
    {
      title: 'Contact',
      image: 'butik-contact.png',
      project: butik,
    },

    // Views for Countrypedia
    {
      title: 'Home',
      image: 'countrypedia-home.png',
      project: countrypedia,
    },
    {
      title: 'Country Details',
      image: 'countrypedia-details.png',
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
