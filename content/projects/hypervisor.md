---
title: Hypervisor (x86 & ARM)
description: Discover Xen Hypervisor, the open-source virtualization platform optimized for both x86 and ARM architectures.
keywords: "Xen Hypervisor, open-source virtualization, x86 virtualization, ARM virtualization, Xen Project, hypervisor technology, virtualization platform, Xen architecture, Xen features, Xen performance, Xen security, Xen scalability, Xen community, Xen development, Xen support, Xen documentation, Xen downloads, Xen project management, Xen team processes, Xen user resources, Xen developer resources"
draft: false
menus:
  main:
    parent: Projects
    weight: 90
aside:
  - type: resource
    items:
      - name: Features (unstable)
        link: https://xenbits.xen.org/docs/unstable/SUPPORT.html
        icon: fas fa-road
      - name: Browse Xen.git
        link: http://xenbits.xenproject.org/gitweb/?p=xen.git;a=summary
        icon: fas fa-code-fork
      - name: Submitting Patches
        link: http://wiki.xenproject.org/wiki/Submitting_Xen_Patches
        icon: fas fa-medkit


      # - title: Project Management
      #   items:
      #     - name: "Status: Active"
      #       icon: fas fa-check
      # - title: Team Processes
      #   items:
      #     - name: Maintenance
      #       link: http://wiki.xenproject.org/wiki/Xen_Maintenance_Releases
      #       icon: fas fa-wrench
      #     - name: Security Process
      #       link: /about/security-policy
      #       icon: fas fa-key
      #     - name: OpenPGP Keys
      #       link: ./openpgp-keys
      #       icon: fas fa-key
      # - title: Users
      #   items:
      #     - name: Downloads
      #       link: /resources/downloads/
      #       icon: fas fa-cube
      #     - name: Docs
      #       link: https://wiki.xenproject.org/wiki/Main_Page#Xen_Started
      #       icon: fas fa-book
      #     - name: xen-users@ mailing list
      #       link: /resources/mailing-lists/#xen-project-hypervisor
      #       icon: fas fa-envelope
      #     - name: "IRC: #xen"
      #       link: /resources/mailing-lists/#xen-project-hypervisor
      #       icon: fas fa-comments-o
      #     - name: Report a Bug
      #       link: http://wiki.xenproject.org/wiki/Reporting_Bugs_against_Xen
      #       icon: fas fa-bug
      #     - name: Xen Project Test Days
      #       link: http://wiki.xenproject.org/wiki/Xen_Test_Days
      #       icon: fas fa-calendar-check-o
      #     - name: Security Announcements
      #       link: https://xenbits.xen.org/xsa/
      #       icon: fas fa-bullhorn
      # - title: Developers
      #   items:
      #     - name: xen-devel@ mailing list
      #       link: /resources/mailing-lists/#xen-project-hypervisor
      #       icon: fas fa-envelope
      #     - name: "IRC: #xendevel"
      #       link: /help/irc/
      #       icon: fas fa-comments-o
         
      #     - name: Repositories and Branches
      #       link: http://wiki.xenproject.org/wiki/Xen_Repositories
      #       icon: fas fa-git
      #     - name: Docs (API and Test)
      #       link: /help/documentation/#xen
      #       icon: fas fa-book
      #     - name: Wiki Dev Home
      #       link: http://wiki.xenproject.org/wiki/XenDevHome
      #       icon: fas fa-globe
      #     - name: Projects for Newbies
      #       link: https://wiki.xenproject.org/wiki/Outreach_Program_Projects
      #       icon: fas fa-cube
      # - title: Project Team
      #   items:
      #     - name: "Release Manager: Henry Wang"
      #       icon: fas fa-briefcase
      #     - name: Andy Cooper
      #       icon: fas fa-star
      #     - name: George Dunlap
      #       icon: fa-star
      #     - name: Jan Beulich
      #       icon: fas fa-star
      #     - name: Julien Grall
      #       icon: fas fa-star
      #     - name: Stefano Stabellini
      #       icon: fas fa-star
      #     - name: Wei Liu
      #       icon: fas fa-star
      #     - name: Maintainers
      #       link: http://xenbits.xenproject.org/gitweb/?p=xen.git;a=blob;f=MAINTAINERS;hb=HEAD
      #       icon: fa-wrench
      # - title: Committer Emeritus
      #   items:
      #     - name: Keir Fraser
      #       icon: fas fa-star
      #     - name: Ian Campbell
      #       icon: fas fa-star
      #     - name: Tim Deegan
      #       icon: fa-star
      #     - name: Ian Jackson
      #       icon: fas fa-star
      #     - name: Konrad R Wilk
      #       icon: fas fa-star
---


{{<section>}}
  {{<media-block
    title="Versatile Open-Source Virtualization"
    media="/img/flatline/data-center.svg"
    alt="Illustration of a person managing server racks, representing data management and server maintenance."
    animate="true"
  >}}
The Xen Project hypervisor is an open-source type-1 or baremetal hypervisor, which makes it possible to run many instances of an operating system or indeed different operating systems in parallel on a single machine (or host). The Xen Project hypervisor is the only type-1 hypervisor that is available as open source. It is used as the basis for a number of different commercial and open source applications, such as: server virtualization, Infrastructure as a Service (IaaS), desktop virtualization, security applications, embedded and hardware appliances. The Xen Project hypervisor is powering the largest clouds in production today.

  <!-- <p class="mg-t-md"><strong>Ressources</strong></p>
  <p class="mg-t-md">
    <a href="https://xenbits.xen.org/docs/unstable/SUPPORT.html" class="btn btn-tertiary">
      Features (unstable) <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
  </p>

  <p class="mg-t-sm">
    <a href="http://xenbits.xenproject.org/gitweb/?p=xen.git;a=summary" class="btn btn-tertiary">
      Browse Xen.git <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
  </p>

  <p class="mg-t-sm">
    <a href="http://wiki.xenproject.org/wiki/Submitting_Xen_Patches" class="btn btn-tertiary">
      Submitting Patches <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
  </p> -->
{{</media-block>}}
{{</section>}}




{{<section class="section-square-rounded">}}
  {{<features-list cols="2">}}
  - title: Small footprint and interface
    icon: fas fa-memory
    description: Because it uses a microkernel design, with a small memory footprint and a restricted interface to guests, it is more robust and secure than other hypervisors.
  - title: Operating system agnostic
    icon: fas fa-cogs
    description: Most installations run with Linux as the main control stack (aka "domain 0”). But a number of other operating systems can be used instead, including NetBSD and FreeBSD.
  - title: Driver Isolation
    icon: fas fa-shield-alt
    description: The Xen Project hypervisor has the capability to allow the main device driver for a system to run inside of a virtual machine. If the driver crashes, or is compromised, the VM containing the driver can be rebooted and the driver restarted without affecting the rest of the system.
  - title: Paravirtualization
    icon: fas fa-window-restore
    description: Paravirtualization allows guests to avoid extra overhead, by making use of devices and interfaces that have been designed for a virtualized environment. Additionally Xen on x86 also supports fully paravirtualized guests, which can run on hardware that doesn’t support virtualization extensions.
  {{</features-list>}}
{{</section>}}



{{<section>}}
  {{<media-block
    title="History"
    media="/img/flatline/timeline.svg"
    alt="Illustration of a timeline with milestones for the years 2012, 2018, 2020, and 2024, representing project progress and development."
    animate="true"
  >}}
The Xen Project hypervisor is developed by a worldwide community of individuals, researchers and employees of companies and that follow the Xen Project Governance process. The project is supported by the Xen Project Advisory Board made up of project member companies that fund the Xen Project. You can find a contribution breakdowns under Contribution Acknowledgments.
{{</media-block>}}
{{</section>}}


