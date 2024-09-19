---
title: Hypervisor (x86 & ARM)
description: Discover Xen Hypervisor, the open-source virtualization platform optimized for both x86 and ARM architectures.
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside:
  - type: resource
    items:
      - title: Project Management
        items:
          - name: "Status: Active"
            icon: fa-check
          - name: Features (unstable)
            link: https://xenbits.xen.org/docs/unstable/SUPPORT.html
            icon: fa-road
      - title: Team Processes
        items:
          - name: Maintenance
            link: http://wiki.xenproject.org/wiki/Xen_Maintenance_Releases
            icon: fa-wrench
          - name: Security Process
            link: /about-xen/security-policy/
            icon: fa-key
          - name: OpenPGP Keys
            link: /developers/openpgp-keys
            icon: fa-key
      - title: Users
        items:
          - name: Downloads
            link: /xen-project-archives/
            icon: fa-cube
          - name: Docs
            link: https://wiki.xenproject.org/wiki/Main_Page#Xen_Started
            icon: fa-book
          - name: xen-users@ mailing list
            link: /help/mailing-list#general
            icon: fa-envelope
          - name: "IRC: #xen"
            link: /help/irc/
            icon: fa-comments-o
          - name: Report a Bug
            link: http://wiki.xenproject.org/wiki/Reporting_Bugs_against_Xen
            icon: fa-bug
          - name: Xen Project Test Days
            link: http://wiki.xenproject.org/wiki/Xen_Test_Days
            icon: fa-calendar-check-o
          - name: Security Announcements
            link: https://xenbits.xen.org/xsa/
            icon: fa-bullhorn
      - title: Developers
        items:
          - name: xen-devel@ mailing list
            link: /help/mailing-list#devel
            icon: fa-envelope
          - name: "IRC: #xendevel"
            link: /help/irc/
            icon: fa-comments-o
          - name: Browse Xen.git
            link: http://xenbits.xenproject.org/gitweb/?p=xen.git;a=summary
            icon: fa-code-fork
          - name: Repositories and Branches
            link: http://wiki.xenproject.org/wiki/Xen_Repositories
            icon: fa-git
          - name: Submitting Patches
            link: http://wiki.xenproject.org/wiki/Submitting_Xen_Patches
            icon: fa-medkit
          - name: Docs (API and Test)
            link: /help/documentation/#xen
            icon: fa-book
          - name: Wiki Dev Home
            link: http://wiki.xenproject.org/wiki/XenDevHome
            icon: fa-globe
          - name: Projects for Newbies
            link: https://wiki.xenproject.org/wiki/Outreach_Program_Projects
            icon: fa-cube
      - title: Project Team
        items:
          - name: "Release Manager: Henry Wang"
            icon: fa-briefcase
          - name: Andy Cooper
            icon: fa-star
          - name: George Dunlap
            icon: fa-star
          - name: Jan Beulich
            icon: fa-star
          - name: Julien Grall
            icon: fa-star
          - name: Stefano Stabellini
            icon: fa-star
          - name: Wei Liu
            icon: fa-star
          - name: Maintainers
            link: http://xenbits.xenproject.org/gitweb/?p=xen.git;a=blob;f=MAINTAINERS;hb=HEAD
            icon: fa-wrench
      - title: Committer Emeritus
        items:
          - name: Keir Fraser
            icon: fa-star
          - name: Ian Campbell
            icon: fa-star
          - name: Tim Deegan
            icon: fa-star
          - name: Ian Jackson
            icon: fa-star
          - name: Konrad R Wilk
            icon: fa-star
---


{{<section>}}
  {{<media-block
    title="TITLE (TODO)"
    media="/img/flatline/data-center.svg"
  >}}
The Xen Project hypervisor is an open-source type-1 or baremetal hypervisor, which makes it possible to run many instances of an operating system or indeed different operating systems in parallel on a single machine (or host). The Xen Project hypervisor is the only type-1 hypervisor that is available as open source. It is used as the basis for a number of different commercial and open source applications, such as: server virtualization, Infrastructure as a Service (IaaS), desktop virtualization, security applications, embedded and hardware appliances. The Xen Project hypervisor is powering the largest clouds in production today.
{{</media-block>}}
{{</section>}}


{{<section class="background-normal"  >}}
  {{<features-list cols="2">}}
  - title: Fast Start
    icon: fas fa-power-off
    description: MirageOS applications takes a few milliseconds to start-up instead of the few minutes that takes traditional OS.
  - title: Small Binaries
    icon: fas fa-floppy-disk
    description: "MirageOS binaries are self-contained: they do not need an additional OS to execute. Despite this, the size of MirageOS binary is usually a few megabytes."
  - title: Small Footprint
    icon: fas fa-minimize
    description: MirageOS applications use a few megabytes of memory, while traditional application and their associated OS waste gigabytes for simple applications.
  - title: Safe Logic
    icon: fas fa-code
    description: MirageOS applications are written in OCaml, an industrial strength programming language supporting functional, imperative and object-oriented styles.
  {{</features-list>}}
{{</section>}}



{{<section>}}
  {{<media-block
    title="History"
    media="/img/flatline/timeline.svg"
  >}}
The Xen Project hypervisor is developed by a worldwide community of individuals, researchers and employees of companies and that follow the Xen Project Governance process. The project is supported by the Xen Project Advisory Board made up of project member companies that fund the Xen Project. You can find a contribution breakdowns under Contribution Acknowledgments.
{{</media-block>}}
{{</section>}}
