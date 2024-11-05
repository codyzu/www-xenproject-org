---
title: Join mailing lists
description: Join the Xen mailing list community to stay updated on the latest developments, discussions, and announcements.
keywords: "Xen mailing lists, Xen community communication, Xen developer discussions, Xen technical support, Xen community forums, Xen announcements, Xen development communication, Xen user support, Xen community engagement, Xen technical discussions, Xen project updates, Xen release announcements, Xen security advisories, Xen event announcements, Xen project collaboration"
date: 2024-01-14T07:07:07+01:00
draft: false
menus:
  main:
    parent: Resources
    weight: 100
keywords: "xen mailing lists, community communication, developer discussions, technical support, community forums, xen announcements, development communication, user support, community engagement, technical discussions"
---

{{<section>}}
  {{<media-block
    title="What does this mean?"
    media="/img/flatline/new-message.svg"
  >}}
  {{<md>}}
- Xen revolutionizes embedded systems, enabling fully-featured operating systems like Linux to coexist with smaller and faster RTOSes such as Zephyr.
- Xen's ability to allocate hardware resources with precision and support multiple communication paradigms between VMs has made it indispensable in diverse applications, from 5G antennas and industrial robots to medical devices and automobiles.
- A significant amount of work has been completed in this area since the team started in 2014. Most work has occurred in Linux, Xen, and OP-TEE.
{{</md>}}
{{</media-block>}}
{{</section>}}


{{<section class="section-square-primary txt-c">}}
  
  {{<md>}}
  Consider **searching in archives**, the answer you are looking might already exist!
  {{</md>}}

  <p class="mg-t-md ">
    <a href="https://lists.xenproject.org/archives/" class="btn btn-primary">
      Check out archives <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
    </p>
{{</section>}}



{{<section class="section-square-rounded">}}
{{<md>}}
## General
{{</md>}}

{{<row-from-list component="card" component-class="card--bg" cols="3">}} 
- title: XEN-ANNOUNCE@
  tags:
    - Mailing list
  description: Announcements related to the project. These may be release announcements, security advisories, announcements related to events. This is a low volume list, with about 1-2 posts per month.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/xen-announce"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/xen-announce"
  secondaryLinkText: Archives

- title: XEN-USERS@
  tags:
    - Mailing list 
  description: This list is for those using and installing the Xen Project software.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/xen-users"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/xen-users"
  secondaryLinkText: Archives

- title: OSSTEST-OUTPUT@
  tags:
    - Mailing list
  description: This is a receive-only list to which detailed test results and reports from the Xen Project Test Lab are sent. This is a very high volume list with 500+ e-mails a day. Only subscribe to it with filters set up. Principal test results are posted to the xen-devel list.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/osstest-output"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/osstest-output"
  secondaryLinkText: Archives

- title: SECURITY@XENPROJECT.ORG
  tags: 
    - Mailing list
  description: This e-mail alias is intended for reporting security vulnerabilities in Xen Project software (this also covers the situation where an existing published codebase is retrospectively found to be a security fix). List membership is restricted to members of the Xen Project Security Response Team and thus invite only and obviously, there is no public archive. For more information on how the Xen Project handles security vulnerabilities, see the Xen Security Problem Response Process.
  link: "mailto:security@xenproject.org"
  linkText: Report Security Issue

- title: PRIVATE@
  tags:
    - Mailing list
  description: This list is for maintainers of all Xen teams, and key developers that have been invited by maintainers. This list is intended to be used only when privacy implications or similar prevent usage of a public list. Example usage may be to let other community members know of absences (due to holidays, maternity/ paternity leave, etc.) and to arrange cover. Another example may be to ask other team members for advice on how to respond to a difficult situation in the community. Any conversations that should have been started on a public list, will be forwarded to an appropriate public list. This list is an invite-only list and is not archived. Community members can subscribe, but approval in line with Mailing List Conventions is required.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/private"
  linkText: Info

- title: PUBLICITY@
  tags:
    - Mailing list
  description: This is a list to coordinate content for the Xen Project blog, articles in the open source and Linux press, other media, press activities, to coordinate attendance and submissions for open source and industry events and anything else to promote the Xen Project. The list is open for people in the community who care about promoting the Xen Project. The list is also archived. To join, please email the Community Manager.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/publicity"
  linkText: Info 
  secondaryLink: "https://lists.xenproject.org/archives/html/publicity"
  secondaryLinkText: Archives

{{</row-from-list>}}




{{<md class="mg-t-xl">}}
## Developpers

### Xen Project Hypervisor
{{</md>}}

{{<row-from-list component="card" component-class="card--bg" cols="3">}} 
- title: XEN-DEVEL@
  tags:
    - Mailing list
  description: A discussion list for the Xen Project Hypervisor developer community. Please do not use this list for technical support queries.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/xen-devel"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/xen-devel"
  secondaryLinkText: Archives

- title: XEN-CHANGELOG@
  tags:
    - Mailing list
  description: This is a receive-only list to which details of changesets to the Xen Hypervisor Git repositories are sent.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/xen-changelog"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/xen-changelog"
  secondaryLinkText: Archives
{{</row-from-list>}}


{{<row cols="3" class="mg-v-lg">}}
{{<col>}}
  {{<md>}}
  ### Mirage OS
  {{</md>}}
  {{<row-from-list component="card" component-class="card--bg" cols="1">}} 
  - title: MIRAGEOS-DEVEL@
    tags:
      - Mailing list
    description: A discussion list for the Mirage OS developer community. Note that most development discussion happens on the respective GitHub (via issues, etc. on the respective repositories).
    link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/mirageos-devel"
    linkText: Info
    secondaryLink: "https://lists.xenproject.org/archives/html/mirageos-devel"
    secondaryLinkText: Archives
  {{</row-from-list>}}
{{</col>}}
{{<col>}}
  {{<md>}}
  ### Unikraft
  {{</md>}}
  {{<row-from-list component="card" component-class="card--bg" cols="1">}} 
  - title: MINIOS-DEVEL@ (INCLUDES UNIKRAFT DEVELOPMENT) 
    tags:
      - Mailing list
    description: A discussion list for MiniOS and Unikraft development.
    important: For patches that need to go into hypervisor/mainline please keep an eye on xen-devel. For development discussions that are MiniOS and Unikraft specific, but impact the hypervisor and/or other sub-projects, please CC the relevant mailing list. For Unikraft code submissions please use the prefix [UNIKRAFT PATCH] xxx, whereas for MiniOS use [PATCH xxx].
    link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/minios-devel"
    linkText: Info
    secondaryLink: "https://lists.xenproject.org/archives/html/minios-devel"
    secondaryLinkText: Archives
  {{</row-from-list>}}
{{</col>}}
{{<col>}}
  {{<md>}}
  ### XAPI
  {{</md>}}
  {{<row-from-list component="card" component-class="card--bg" cols="1">}} 
  - title: XEN-API@
    tags:
      - Mailing list
    description: A discussion list for the XAPI project, developing an open-source management layer for Xen-based systems. The list is both for developers and users.
    note: Note that most technical discussions for the Xen-API project happen on GitHub (via issues, etc. on the respective repositories).
    link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/xen-api"
    linkText: Info
    secondaryLink: "https://lists.xenproject.org/archives/html/xen-api"
    secondaryLinkText: Archives
  {{</row-from-list>}}
{{</col>}}
{{</row>}}


{{<md>}}
### XCP-ng
{{</md>}}
{{<row-from-list component="card" component-class="card--bg" cols="3" class="mg-b-lg">}} 
- title: XCP-NG FORUMS
  tags:
    - Forum
  description: Announcements related to the project. These may be release announcements, security advisories, announcements related to events. This is a low volume list, with about 1-2 posts per month.
  link: "https://xcp-ng.org/forum/"
  linkText: All forums
  secondaryLink: "https://xcp-ng.org/forum/category/7/development"
  secondaryLinkText: Development

- title: XCP-NG NEWSLETTER
  tags:
    - Newsletter
  description: This list is for those using and installing the Xen Project software.
  link: "http://eepurl.com/gtO5-H"
  linkText: Subscribe

- title: XCP-ng-dev
  tags:
    - Forum
  description: For developer specific questions and those who want to contribute, this channel is for you, based on XCP-ng forum.
  link: "TODO"
  linkText: Info
  secondaryLink: "TODO"
  secondaryLinkText: Archives
{{</row-from-list>}}


{{<md>}}
### Windows PV Drivers
{{</md>}}
{{<row-from-list component="card" component-class="card--bg" cols="3">}} 
- title: WIN-PV-DEVEL@
  tags:
    - Mailing list
  description: A discussion list for the Windows PV Drivers developer community.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/win-pv-devel"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/win-pv-devel"
  secondaryLinkText: Archives
{{</row-from-list>}}
    

{{<md class="mg-t-xl">}}
## Advisory board

{{</md>}}
{{<row-from-list component="card" component-class="card--bg" cols="3">}} 
- title: PREDISCLOSURE-APPLICATIONS@
  tags:
    - Mailing list
  description: |
    Organizations who want to become a member of the Xen Project predisclosure list to receive pre-disclosure of security advisories and who meet the criteria outlined in the Xen Security Problem Response Process should become members of this mailing list and submit their application through this mailing list as outlined in Xen Security Problem Response Process.
    
    The list is open to all community members who care about security and although pre-disclosure membership applications are evaluated based on strict criteria, all applications are open for review and comment by community members. The list is also archived.
  link: "https://lists.xenproject.org/cgi-bin/mailman/listinfo/predisclosure-applications"
  linkText: Info
  secondaryLink: "https://lists.xenproject.org/archives/html/predisclosure-applications"
  secondaryLinkText: Archives

- title: ADVISORY-BOARD@
  tags:
    - Mailing list
  description: A discussion list for members of the Xen Project Advisory Board. The list is invite-only.
  link: "http://wiki.xenproject.org/wiki/Category:Advisory_Board"
  linkText: Info
{{</row-from-list>}}
{{</section>}}



{{<section class="txt-c">}}
<a href="http://wiki.xenproject.org/wiki/Xen_Users_Netiquette" class="btn btn-primary">
  Mailing list Netiquette
  <i class="fas fa-arrow-up-right-from-square"></i>
</a>

<a href="http://wiki.xenproject.org/wiki/Xen_Mailing_List_Moderators" class="btn btn-secondary mg-l-lg">
  Mailing list moderators
  <i class="fas fa-arrow-up-right-from-square"></i> 
</a>

{{</section>}}
