import { MigrationInterface, QueryRunner } from 'typeorm';
import { Experience } from '../../experience/experience.entity'; // Adjust the path to your Experience entity
import { Position } from '../../experience/position.entity';

export class SeedExperienceData1732994102083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const experienceRepository = queryRunner.manager.getRepository(Experience);
    const positionRepository = queryRunner.manager.getRepository(Position);

    // Insert Experiences
    const experiences = await experienceRepository.save([
      {
        id: '1',
        company: 'Fujitsu Technology Solutions',
        period: '10/2022 - present',
      },
      {
        id: '2',
        company: 'Freelancer Web Development',
        period: '10/2021 - 10/2022',
      },
    ]);

    // Insert Positions for Experience 1 (Fujitsu Technology Solutions)
    await positionRepository.save([
      {
        title: 'Software Developer',
        period: '2024/05-present',
        description:
          "I have made a substantial impact on the architecture of a large-scale application, helping to shape the software’s development in this role. I've worked in a fully integrated team setup, collaborating with scrum masters, QA specialists, developers, product owners, and designers. Our project serves a diverse user base, from young students to educators, and meets WCAG 2.1 AA Accessibility standards. Maintaining responsiveness and compatibility across all devices and platforms, the application is set for ongoing evolution and long-term success.",
        skills: ['React', 'TypeScript', 'WCAG 2.1 AA', 'AWS', 'Azure', 'PWA'],
        experience: experiences[0],
      },
      {
        title: 'Associate Software Developer',
        period: '2023/04-2024/04',
        description:
          'While working as an Assistant, I transitioned into a frontend role on a React TypeScript project, which led to my promotion to Associate Software Developer. Collaborating with a Japanese product owner, the project targeted UK-based clients. This gave me valuable experience in an international team, and I grew through active participation in code reviews and leading meetings such as refinement and daily stand-ups.',
        skills: [
          'React',
          'TypeScript',
          'React Query',
          'Unit Tests',
          'Redux Toolkit',
          'Zustand',
          'React Hook Form',
        ],
        experience: experiences[0],
      },
      {
        title: 'Assistant Software Developer',
        period: '2022/10-2023/04',
        description:
          'At Fujitsu, I began as an Assistant Software Developer, working on a jQuery project to become familiar with scrum and legacy code. Later, I gained hands-on experience writing end-to-end tests in Cypress for a TypeScript-based Angular project, contributing to its ongoing development and ensuring code quality.',
        skills: ['Cypress', 'e2e tests', 'TypeScript', 'jQuery', 'Scrum'],
        experience: experiences[0],
      },
    ]);

    // Insert Positions for Experience 2 (Freelancer Web Development)
    await positionRepository.save([
      {
        title: 'Web Developer',
        period: '2021-2022',
        description:
          'As a Freelance Web Developer, I created custom websites tailored to client needs, focusing on clean design and intuitive user experience. One of my key projects was for a car mechanic, where I balanced functionality with a professional look. I also worked on a boutique project that explored various design approaches, but it didn’t reach production.',
        skills: [
          'HTML',
          'CSS',
          'SCSS',
          'Bootstrap',
          'JavaScript',
          'Freelance',
          'Web Design',
        ],
        experience: experiences[1],
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const positionRepository = queryRunner.manager.getRepository(Position);
    const experienceRepository = queryRunner.manager.getRepository(Experience);

    // Delete Positions
    await positionRepository.delete({});
    // Delete Experiences
    await experienceRepository.delete({});
  }
}
