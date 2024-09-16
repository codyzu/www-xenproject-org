---
title: Mirage OS
description: MirageOS is a library operating system that constructs unikernels for secure, high-performance, low-energy footprint applications.
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside:
  - type: resource
    items:
      - name: Label
        url: TODO
      - name: Label
        url: TODO
---

{{<section>}}
  {{<media-block
    title="About us"
    media="/img/flatline/data_and_settings.svg"
  >}}
MirageOS is a library operating system that constructs unikernels for secure, high-performance, low-energy footprint applications across various hypervisor and embedded platforms. It is available as an open-source project created and maintained by the MirageOS Core Team. A unikernel can be customised based on the target architecture by picking the relevant MirageOS libraries and compiling them into a standalone operating system, strictly containing the functionality necessary for the target. This minimises the unikernel’s footprint, increasing the security of the deployed operating system.
{{</media-block>}}
{{</section>}}

{{<section md="true">}}
### Our architecture

The MirageOS architecture can be divided into operating system libraries, typed signatures, and a metaprogramming compiler. The operating system libraries implement various functionalities, ranging from low-level network card drivers to full reimplementations of the TLS protocol, as well as the Git protocol to store versioned data. A set of typed signatures ensures that the OS libraries are consistent and work well in conjunction with each other. Most importantly, MirageOS is also a metaprogramming compiler that can input OCaml source code along with its dependencies, and a deployment target description to generate an executable unikernel, i.e., a specialised binary artefact containing only the code needed to run on the target platform. Overall, MirageOS focuses on providing a small, well-defined, typed interface with the system components of the target architecture.
{{</section>}}


{{<section class="background-normal"  >}}
  {{<features-list cols="2">}}
  - title: Small footprint and interface
    icon: fas fa-memory
    description: Because it uses a microkernel design, with a small memory footprint and a restricted interface to guests, it is more robust and secure than other hypervisors.
  - title: Operating system agnostic
    icon: fas fa-gears
    description: Most installations run with Linux as the main control stack (aka "domain 0"). But a number of other operating systems can be used instead, including NetBSD and FreeBSD.
  - title: Driver Isolation
    icon: fas fa-shield-halved
    description: The Xen Project hypervisor has the capability to allow the main device driver for a system to run inside of a virtual machine. If the driver crashes, or is compromised, the VM containing the driver can be rebooted and the driver restarted without affecting the rest of the system.
  - title: Paravirtualization
    icon: fas fa-window-restore
    description: Paravirtualization allows guests to avoid extra overhead, by making use of devices and interfaces that have been designed for a virtualized environment. Additionally Xen on x86 also supports fully paravirtulized guests, which can run on hardware that doesn't support virtualization extensions.
  {{</features-list>}}
{{</section>}}



{{<section>}}
  {{<media-block
    title="**Development** process"
    media="/img/flatline/coding.svg"
    mediaPosition="right"
  >}}
Mirage OS follows a standard Github workflow and has its own Developer Portal. All developer-related information such as documentation, development team members, and other information related to the development of Mirage OS can be found there as well.
{{</media-block>}}
{{</section>}}

{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
  >}}
{{<md>}}
  The Mirage codebase is released under the ISC license, with some portions of code released under LGPLv2.
  
  Sub-Projects hosted by the Xen Project team typically use GPLv2. In the case of Mirage, it is necessary to use a permissive open source license such as “ISC” because Mirage based microkernels need to be statically linked with applications to form a stand-alone appliance.
{{</md>}}
{{</media-block>}}
{{</section>}}