---
title: Windows PV Drivers
description: Windows PV Drivers enhance the performance and efficiency of Windows virtual machines. Access documentation and support for seamless integration.
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside:
  - type: resource
    items:
      - name: Download
        link: /resources/downloads
        icon: fas fa-arrow-right
      - name: Documentation
        link: https://wiki.xenproject.org/wiki/Category:Windows_PV_Drivers
keywords: "windows PV drivers, paravirtualization drivers, windows virtualization, xen windows support, virtual device drivers, windows virtual machines, paravirtualized windows, virtualization drivers, windows VM optimization, virtual hardware drivers"
---

{{<section>}}
  {{<media-block
    title="About Windows PV Drivers"
    media=`{{<youtube id="3R_IxOlP548" title="Xen Project's Progress Toward Safety Certification"  >}}`
    alt="Video of a presentation about Windows PV Drivers on Youtube"
    animate="true"
  >}}
  {{<md>}}
Paravirtualization aware (PV) device drivers are an important part of HVM guests running under the Xen Project Hypervisor.

Citrix has provided a set of PV driver for Windows since the inception of XenServer. These drivers have evolved over the years and the full source code has been made available under a BSD license and are available to the community to modify and build upon.

The Windows PV Drivers team at the Xen Project is maintaining and developing these drivers under Xen Project governance.
{{</md>}}
{{</media-block>}}
{{</section>}}

{{<section>}}
{{<md>}}
## Downloads
{{</md>}}

{{<cols cols="2">}}
  {{<col>}}
    The team plans to perform regular builds of the drivers and aims to test them using the Microsoft HCK. The team further plans to provide logo-signed builds of the drivers in future commercial Xen offerings. The team may also provide logo-signed drivers via Microsoft’s Windows Update mechanism, making them widely available to anyone running Windows under Xen (not just XenServer) without the need to build the drivers themselves. 

    <p class="mg-t-md">
      <a href="https://xenbits.xen.org/gitweb/?p=pvdrivers/win.git;a=summary" class="btn btn-primary">
       Download developement builds
       <i class="fas fa-arrow-up-right-from-square"></i>
      </a>
    </p>
  {{</col>}}

{{<col>}}
  {{<md>}}
  Any other organization is also free to do the same by registering a top-level PV device with the Xen Project community (see *Xen PCI device ID registry*) and logo-signing their driver builds.
  Please sign up and follow the [win-pv-devel@mailing list](https://xenproject.org/help/mailing-list/) for status and development updates.
  {{</md>}}

    <p class="mg-t-md">
       <a href="https://wiki.xenproject.org/wiki/Windows_PV_Drivers/Installing" class="btn btn-secondary">
        Read installation driver wiki
        <i class="fas fa-arrow-up-right-from-square"></i>
      </a>
    </p>
  {{</col>}}
{{</cols>}}
{{</section>}}


{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
    alt="Illustration of hands typing code on a laptop with documents and a cup of coffee, symbolizing software development and workflow."
    animate="true"
  >}}
{{<md>}}
The drivers are available under a [simplified 2-clause BSD license](https://en.wikipedia.org/wiki/BSD_licenses#2-clause_license_.28.22Simplified_BSD_License.22_or_.22FreeBSD_License.22.29). The code can be found in the following repositories on [xenbits.xen.org](https://xenbits.xen.org/gitweb/) in the [pvdrivers/win](https://xenbits.xen.org/gitweb/?a=project_list;pf=pvdrivers/win) folder.
{{</md>}}
{{</media-block>}}
{{</section>}}

