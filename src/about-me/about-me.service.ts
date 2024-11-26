import { Injectable } from '@nestjs/common';

@Injectable()
export class AboutMeService {
  private aboutMe = [
    {
      id: '1',
      year: 2021,
      title: 'Łódź University of Technology',
      description:
        "I hold a bachelor's degree from the Faculty of Electrical, Electronic, Computer, and Control Engineering, specializing in Power Engineering. During my studies, I participated in workshops that introduced me to programming and sparked my interest in software development.",
      icon: 'fa-solid fa-graduation-cap',
    },
    {
      id: '2',
      year: 2022,
      title: 'First commercial website as freelancer',
      description:
        'My first commercial project was a simple website I built for a family member who runs a car mechanic business. I took on the challenge of creating a functional and visually appealing website using HTML, CSS/SCSS, and JavaScript.',
      icon: 'fa-solid fa-wrench',
    },
    {
      id: '3',
      year: 2022,
      title: 'First software developer job',
      description:
        "My first software development job was at Fujitsu, where I started as a full-time intern and continue to work as a Frontend Developer. Throughout my time here, I've been involved in various projects that have allowed me to deepen my skills and experience.",
      icon: 'fa-solid fa-laptop-code',
    },
    {
      id: '4',
      year: 2024,
      title: 'AWS Certified Associate Developer',
      description:
        'I am a certified AWS Associate Developer, a certification I achieved after dedicating significant time and effort to mastering cloud technologies. Preparing for the exam was a challenging but rewarding experience.',
      icon: 'fa-brands fa-aws',
    },
  ];

  findAll() {
    return this.aboutMe;
  }

  findOne(id: string) {
    return this.aboutMe.find((item) => item.id === id);
  }
}
