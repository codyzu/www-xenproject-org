export type MemberOrganization = {
  name: string;
  logo: string;
  href: string;
  membershipLevel: 'Advisory Board member';
  summary: string;
};

export type MemberLogo = {
  label: string;
  src: string;
  href: string;
};

export const memberOrganizations: MemberOrganization[] = [
  {
    name: 'AMD',
    logo: '/img/logos/amd-logo.svg',
    href: 'http://www.amd.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Semiconductor and computing platforms.',
  },
  {
    name: 'ARM',
    logo: '/img/logos/arm-logo.svg',
    href: 'https://www.arm.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Processor architecture and semiconductor IP.',
  },
  {
    name: 'AWS',
    logo: '/img/logos/aws-logo.svg',
    href: 'https://aws.amazon.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Cloud infrastructure and services.',
  },
  {
    name: 'Boeing',
    logo: '/img/logos/boeing-logo.svg',
    href: 'https://www.boeing.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Aerospace platforms and engineering.',
  },
  {
    name: 'EPAM',
    logo: '/img/logos/epam-logo.svg',
    href: 'https://www.epam.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Digital platform and software engineering.',
  },
  {
    name: 'Ford Motor Company',
    logo: '/img/logos/ford-logo.svg',
    href: 'https://ford.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Automotive platforms and mobility.',
  },
  {
    name: 'Honda',
    logo: '/img/logos/honda-logo.svg',
    href: 'https://www.honda.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Automotive and mobility technology.',
  },
  {
    name: 'Renesas',
    logo: '/img/logos/renesas-logo-cropped.svg',
    href: 'https://www.renesas.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Embedded and automotive semiconductors.',
  },
  {
    name: 'Vates',
    logo: '/img/logos/vates-logo.svg',
    href: 'https://vates.fr/',
    membershipLevel: 'Advisory Board member',
    summary: 'Open source virtualization platforms.',
  },
  {
    name: 'XenServer',
    logo: '/img/logos/xenserver-logo.svg',
    href: 'https://www.xenserver.com/',
    membershipLevel: 'Advisory Board member',
    summary: 'Virtualization platform engineering.',
  },
];

export const memberLogos: MemberLogo[] = memberOrganizations.map((member) => ({
  label: member.name,
  src: member.logo,
  href: member.href,
}));
