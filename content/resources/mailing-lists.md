---
title: Join mailing lists
description: Join the Xen mailing list community to stay updated on the latest developments, discussions, and announcements.
date: 2024-01-14T07:07:07+01:00
draft: false
menus:
  main:
    parent: Resources
    weight: 100
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


{{<section background="curve" class="txt-c">}}
  
  {{<md>}}
  Consider **searching in archives**, the answer you are looking might already exist!
  {{</md>}}

  <p class="mg-t-md ">
    <a href="https://lists.xenproject.org/archives/" class="btn btn-secondary">
      Check out archives <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
    </p>
{{</section>}}



{{<section>}}
{{<md>}}
## General
{{</md>}}

{{<row-from-list component="conversation-card" cols="3">}} 
- label: XEN-ANNOUNCE@
  tags:
    - Mailing list
  content: Announcements related to the project. These may be release announcements, security advisories, announcements related to events. This is a low volume list, with about 1-2 posts per month.
  actions:
    - url: "#"
      text: Info
    - url: "#" 
      text: Archives

- label: XEN-USERS@
  tags:
    - Mailing list 
  content: This list is for those using and installing the Xen Project software.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

- label: OSSTEST-OUTPUT@
  tags:
    - Mailing list
  content: This is a receive-only list to which detailed test results and reports from the Xen Project Test Lab are sent. This is a very high volume list with 500+ e-mails a day. Only subscribe to it with filters set up. Principal test results are posted to the xen-devel list.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

- label: SECURITY@XENPROJECT.ORG
  tags: 
    - Mailing list
  content: This e-mail alias is intended for reporting security vulnerabilities in Xen Project software (this also covers the situation where an existing published codebase is retrospectively found to be a security fix). List membership is restricted to members of the Xen Project Security Response Team and thus invite only and obviously, there is no public archive. For more information on how the Xen Project handles security vulnerabilities, see the Xen Security Problem Response Process.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

- label: PRIVATE@
  tags:
    - Mailing list
  content: This list is for maintainers of all Xen teams, and key developers that have been invited by maintainers. This list is intended to be used only when privacy implications or similar prevent usage of a public list. Example usage may be to let other community members know of absences (due to holidays, maternity/ paternity leave, etc.) and to arrange cover. Another example may be to ask other team members for advice on how to respond to a difficult situation in the community. Any conversations that should have been started on a public list, will be forwarded to an appropriate public list. This list is an invite-only list and is not archived. Community members can subscribe, but approval in line with Mailing List Conventions is required.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

- label: PUBLICITY@
  tags:
    - Mailing list
  content: This is a list to coordinate content for the Xen Project blog, articles in the open source and Linux press, other media, press activities, to coordinate attendance and submissions for open source and industry events and anything else to promote the Xen Project. The list is open for people in the community who care about promoting the Xen Project. The list is also archived. To join, please email the Community Manager.
  actions:
    - url: "#"
      text: Info 
    - url: "#"
      text: Archives

{{</row-from-list>}}
{{</section>}}



{{<section>}}
{{<md>}}
## Developpers

### Xen Project Hypervisor
{{</md>}}

{{<row-from-list component="conversation-card" cols="3">}} 
- label: XEN-DEVEL@
  tags:
    - Mailing list
  content: A discussion list for the Xen Project Hypervisor developer community. Please do not use this list for technical support queries.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives
- label: XEN-CHANGELOG@
  tags:
    - Mailing list
  content: This is a receive-only list to which details of changesets to the Xen Hypervisor Git repositories are sent.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives
{{</row-from-list>}}


{{<row cols="3" class="mg-v-lg">}}
{{<col>}}
  {{<md>}}
  ### Mirage OS
  {{</md>}}
  {{<row-from-list component="conversation-card" cols="1">}} 
  - label: MIRAGEOS-DEVEL@
    tags:
      - Mailing list
    content: A discussion list for the Mirage OS developer community. Note that most development discussion happens on the respective GitHub (via issues, etc. on the respective repositories).
    actions:
      - url: "#"
        text: Info
      - url: "#"
        text: Archives
  {{</row-from-list>}}
{{</col>}}
{{<col>}}
  {{<md>}}
  ### Unikraft
  {{</md>}}
  {{<row-from-list component="conversation-card" cols="1">}} 
  - label: MINIOS-DEVEL@ (INCLUDES UNIKRAFT DEVELOPMENT) 
    tags:
      - Mailing list
    content: A discussion list for MiniOS and Unikraft development.
    important: For patches that need to go into hypervisor/mainline please keep an eye on xen-devel. For development discussions that are MiniOS and Unikraft specific, but impact the hypervisor and/or other sub-projects, please CC the relevant mailing list. For Unikraft code submissions please use the prefix [UNIKRAFT PATCH] xxx, whereas for MiniOS use [PATCH xxx].
    actions:
      - url: "#"
        text: Info
      - url: "#"
        text: Archives
  {{</row-from-list>}}
{{</col>}}
{{<col>}}
  {{<md>}}
  ### XAPI
  {{</md>}}
  {{<row-from-list component="conversation-card" cols="1">}} 
  - label: XEN-API@
    tags:
      - Mailing list
    content: A discussion list for the XAPI project, developing an open-source management layer for Xen-based systems. The list is both for developers and users.
    note: Note that most technical discussions for the Xen-API project happen on GitHub (via issues, etc. on the respective repositories).
    actions:
      - url: "#"
        text: Info
      - url: "#"
        text: Archives
  {{</row-from-list>}}
{{</col>}}
{{</row>}}


{{<md>}}
### XCP-ng
{{</md>}}
{{<row-from-list component="conversation-card" cols="3" class="mg-b-lg">}} 
- label: XCP-NG FORUMS
  tags:
    - Forum
  content: Announcements related to the project. These may be release announcements, security advisories, announcements related to events. This is a low volume list, with about 1-2 posts per month.
  actions:
    - url: "#"
      text: All forums
    - url: "#"
      text: Development
- label: XCP-NG NEWSLETTER
  tags:
    - Newsletter
  content: This list is for those using and installing the Xen Project software.
  actions:
    - url: "#"
      text: Subscribe
- label: XCP-ng-dev
  tags:
    - Forum
  content: For developer specific questions and those who want to contribute, this channel is for you, based on XCP-ng forum.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives
{{</row-from-list>}}


{{<md>}}
### Windows PV Drivers
{{</md>}}
{{<row-from-list component="conversation-card" cols="3">}} 
- label: WIN-PV-DEVEL@
  tags:
    - Mailing list
  content: A discussion list for the Windows PV Drivers developer community.
  actions:
    - url: "#"
      text: Info 
    - url: "#"
      text: Archives
{{</row-from-list>}}
    
{{</section>}}





{{<section>}}
{{<md>}}
## Advisory board

{{</md>}}
{{<row-from-list component="conversation-card" cols="3">}} 
- label: PREDISCLOSURE-APPLICATIONS@
  tags:
    - Mailing list
  content: |
    Organizations who want to become a member of the Xen Project predisclosure list to receive pre-disclosure of security advisories and who meet the criteria outlined in the Xen Security Problem Response Process should become members of this mailing list and submit their application through this mailing list as outlined in Xen Security Problem Response Process.
    
    The list is open to all community members who care about security and although pre-disclosure membership applications are evaluated based on strict criteria, all applications are open for review and comment by community members. The list is also archived.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

- label: ADVISORY-BOARD@
  tags:
    - Mailing list
  content: A discussion list for members of the Xen Project Advisory Board. The list is invite-only.
  actions:
    - url: "#"
      text: Info
    - url: "#"
      text: Archives

{{</row-from-list>}}

{{</section>}}


{{<section class="txt-c">}}
<a href="TODO" class="btn btn-primary">
  Mailing list Netiquette
  <i class="fas fa-arrow-up-right-from-square"></i>
</a>

<a href="TODO" class="btn btn-secondary mg-l-lg">
  Mailing list moderators
  <i class="fas fa-arrow-up-right-from-square"></i> 
</a>

{{</section>}}