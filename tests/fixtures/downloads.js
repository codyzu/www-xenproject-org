export const downloadsFixture = [
  {
    name: 'Xen',
    key: 'xen',
    versions: [
      {name: '4.21.1', link: 'https://downloads.xenproject.org/release/xen/4.21.1/', files: []},
      {name: '4.20.2', link: 'https://downloads.xenproject.org/release/xen/4.20.2/', files: []},
    ],
  },
  {
    name: 'XCP-ng',
    key: 'xcpng',
    versions: [{
      name: '8.3',
      link: 'https://mirrors.xcp-ng.org/isos/8.3/?https=1',
      files: [
        {name: 'xcp-ng-8.3.0-20260806.iso', url: 'https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20260806.iso?https=1'},
        {name: 'xcp-ng-8.3.0-20260806-netinstall.iso', url: 'https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20260806-netinstall.iso?https=1'},
        {name: 'SHA256SUMS', url: 'https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS?https=1'},
        {name: 'SHA256SUMS.asc', url: 'https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS.asc?https=1'},
      ],
    }],
  },
  {
    name: 'Mirage OS',
    key: 'mirageos',
    versions: [{name: '4.11.2', link: 'https://github.com/mirage/mirage/releases/tag/v4.11.2', files: []}],
  },
];
