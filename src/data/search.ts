const routeSections: Array<[prefix: string, section: string]> = [
  ['/technology/isolation-and-security/', 'Security'],
  ['/technology/safety/', 'Safety'],
  ['/about/security-policy/', 'Security'],
  ['/resources/past-events/', 'Events'],
  ['/resources/summit-', 'Events'],
  ['/about/become-a-member/', 'Membership'],
  ['/about/project-members/', 'Membership'],
  ['/contribute/', 'Community'],
  ['/community/', 'Community'],
  ['/projects/', 'Documentation'],
  ['/technology/', 'Documentation'],
  ['/research/', 'Documentation'],
  ['/resources/', 'Documentation'],
  ['/more/', 'Releases'],
  ['/about/', 'About'],
];

export function sectionForPath(pathname: string) {
  return routeSections.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? 'About';
}
