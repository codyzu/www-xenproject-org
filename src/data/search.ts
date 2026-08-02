const routeSections: Array<[prefix: string, section: string]> = [
  ['/technology/isolation-and-security/', 'Security'],
  ['/technology/safety/', 'Safety'],
  ['/about/security-policy/', 'Security'],
  ['/projects/hypervisor/openpgp-keys/', 'Security'],
  ['/resources/downloads/', 'Releases'],
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
  ['/more/', 'About'],
  ['/about/', 'About'],
];

const aliasGroups = [
  ['dom0', 'control domain'],
  ['Dom0less', 'dom0-less', 'without a control domain'],
  ['domU', 'guest domain'],
  ['XenStore', 'Xen Store'],
  ['XSA', 'Xen Security Advisory'],
  ['PVH', 'paravirtualized hardware'],
  ['HVM', 'hardware virtual machine'],
  ['XAPI', 'Xen API'],
  ['VMI', 'virtual machine introspection'],
  ['live migration', 'VM migration'],
] as const;

const escapePattern = (value: string) => value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

export function searchAliasesForText(value: string) {
  const aliases = new Map<string, string>();
  for (const group of aliasGroups) {
    const matched = group.some((term) =>
      new RegExp(`(^|[^a-z0-9])${escapePattern(term)}(?=$|[^a-z0-9])`, 'i').test(value),
    );
    if (!matched) continue;
    for (const term of group) aliases.set(term.toLocaleLowerCase('en'), term);
  }

  return [...aliases.values()];
}

export function sectionForPath(pathname: string) {
  return routeSections.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? 'About';
}
