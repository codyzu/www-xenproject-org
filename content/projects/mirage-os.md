---
title: Mirage OS
description: MirageOS is a library operating system that constructs unikernels for secure, high-performance, low-energy footprint applications.
draft: false
menus:
  main:
    parent: Projects
    weight: 100
keywords: "mirage os, unikernel, library operating system, secure virtualization, lightweight virtualization, OCaml unikernel, specialized operating system, cloud computing, minimalist OS, secure deployment"
---

{{<section>}}
  {{<media-block
    title="About us"
    media="/img/flatline/data_and_settings.svg"
    alt="Illustration of a database icon with gears and a wrench, representing data management and configuration tools."
    animate="true"
  >}}
MirageOS is a library operating system that constructs unikernels for secure, high-performance, low-energy footprint applications across various hypervisor and embedded platforms. It is available as an open-source project created and maintained by the MirageOS Core Team. A unikernel can be customised based on the target architecture by picking the relevant MirageOS libraries and compiling them into a standalone operating system, strictly containing the functionality necessary for the target. This minimises the unikernel’s footprint, increasing the security of the deployed operating system.
{{</media-block>}}
{{</section>}}

{{<section md="true">}}
## Our architecture

The MirageOS architecture can be divided into operating system libraries, typed signatures, and a metaprogramming compiler. The operating system libraries implement various functionalities, ranging from low-level network card drivers to full reimplementations of the TLS protocol, as well as the Git protocol to store versioned data. A set of typed signatures ensures that the OS libraries are consistent and work well in conjunction with each other. Most importantly, MirageOS is also a metaprogramming compiler that can input OCaml source code along with its dependencies, and a deployment target description to generate an executable unikernel, i.e., a specialised binary artefact containing only the code needed to run on the target platform. Overall, MirageOS focuses on providing a small, well-defined, typed interface with the system components of the target architecture.
{{</section>}}


{{<section  class="section-square-rounded" >}}
  {{<features-list cols="2">}}
  - title: Fast Start
    icon: fas fa-power-off
    description: MirageOS applications take a few milliseconds to start-up instead of the few minutes that traditional OS takes.
  - title: Small Binaries
    icon: fas fa-floppy-disk
    description: "MirageOS binaries are self-contained: they do not need an additional OS to execute. Despite this, the size of MirageOS binary is usually a few megabytes."
  - title: Small Footprint
    icon: fas fa-minimize
    description: MirageOS applications use a few megabytes of memory, while traditional applications and their associated OS waste gigabytes for simple applications.
  - title: Safe Logic
    icon: fas fa-code
    description: MirageOS applications are written in OCaml, an industrial strength programming language supporting functional, imperative, and object-oriented styles.
  {{</features-list>}}
{{</section>}}

{{<section>}}
  {{<media-block
    title="**Development** process"
    media="/img/flatline/coding.svg"
    mediaPosition="right"
    alt="Illustration of a person typing code on a computer, symbolizing software development and programming."
    animate="true"
  >}}
Mirage OS follows a standard Github workflow and has its own Developer Portal. All developer-related information such as documentation, development team members, and other information related to the development of Mirage OS can be found there as well.
{{</media-block>}}
{{</section>}}

{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
    alt="Illustration of hands typing code on a laptop with documents and a cup of coffee, symbolizing software development and workflow."
    animate="true"
  >}}
{{<md>}}
  The Mirage codebase is released under the ISC license, with some portions of code released under LGPLv2.
  
  Sub-Projects hosted by the Xen Project team typically use GPLv2. In the case of Mirage, it is necessary to use a permissive open source license such as “ISC” because Mirage based microkernels need to be statically linked with applications to form a stand-alone appliance.
{{</md>}}
{{</media-block>}}
{{</section>}}
