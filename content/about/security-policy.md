---
title: Security policy
description: Xen Security Problem Response Process
keywords: "Xen Security Policy, Xen Security Process, Xen Security Response, Xen Security Team, Xen Security Issues, Xen Security Problem, Xen Security Disclosure, Xen Security Reporting, Xen Security Management, Xen Security Procedures, Xen Security Guidelines, Xen Security Best Practices, Xen Security Protocols, Xen Security Measures, Xen Security Standards, Xen Security Compliance, Xen Security Vulnerabilities, Xen Security Threats, Xen Security Mitigation, Xen Security Solutions"

date: 2024-01-14T07:07:07+01:00
draft: false
layout: single
menus:
  main:
    parent: About
    weight: 50

asidePosition: before
aside:
  - type: resource
    items:
      - name: OpenPGP Keys
        link: /developers/openpgp-keys
        icon: fa-key
      - name: Raise a security issue
        link: /help/mailing-list#security-at
        icon: fa-key
      - name: List Applications
        link: /help/mailing-list#predisclosure-applications
        icon: fa-key
  - type: members-list
    name: Team Members 
    items:
      - icon: fa-star
        name: Andrew Cooper
      - icon: fa-star
        name: George Dunlap
      - icon: fa-star
        name: Ian Jackson
      - icon: fa-star
        name: Jan Beulich
      - icon: fa-star
        name: Julien Grall
      - icon: fa-star
        name: Jürgen Groß
      - icon: fa-star
        name: Stefano Stabellini
      - icon: fa-star
        name: Wei Liu
      - icon: fa-star
        name: Roger Pau Monné
  - type: members-list
    name: Emeritus Team Members
    items: 
      - icon: fa-star
        name: Ian Campbell
      - icon: fa-star
        name: Konrad R Wilk
      - icon: fa-star
        name: Tim Deegan
---

{{<section md="true" class="content-markdown">}}
This document has come in effect in December 2011 and will be reviewed periodically: see [Change History](#change-history) for a detailed list of changes.

## Introduction

Computer systems have bugs. Currently recognised best practice for bugs with security implications is to notify significant downstream users in private; leave a reasonable interval for downstreams to respond and prepare updated software packages; then make public disclosure.

We want to encourage people to report bugs they find to us. Therefore we will treat with respect the requests of discoverers, or other vendors, who report problems to us.

## Scope of this process

This process primarily covers the [Xen Hypervisor Project](/developers/teams/xen-hypervisor/). Specific information about features with security support can be found in

1.  [SUPPORT.md](http://xenbits.xen.org/gitweb/?p=xen.git;a=blob;f=SUPPORT.md) in the releases’ tar ball and its xen.git tree and on [web pages generated from the SUPPORT.md file](https://xenbits.xen.org/docs/unstable/support-matrix.html)
2.  For releases that do not contain SUPPORT.md, this information can be found on the [Release Feature wiki page](https://wiki.xenproject.org/wiki/Xen_Project_Release_Features)

Vulnerabilities reported against other Xen Project teams will be handled on a best effort basis by the relevant Project Lead together with the Security Response Team.

## Specific process

1.  We request that anyone who discovers a vulnerability in Xen Project software reports this by email to security (at) xenproject (dot) org. (This also covers the situation where an existing published changeset is retrospectively found to be a security fix)
2.  Immediately, and in parallel:
    1.  Those of us on the Hypervisor team who are aware of the problem will notify security@xenproject if disclosure wasn’t made there already.
    2.  If the vulnerability is not already public, security@xenproject will negotiate with discoverer regarding embargo date and disclosure schedule. See below for detailed discussion.
3.  Furthermore, also in parallel:
    
    1.  security@xenproject will check whether the discoverer, or other people already aware of the problem, have allocated a CVE number. If not, we will acquire a CVE candidate number ourselves, and make sure that everyone who is aware of the problem is also aware of the CVE number.
    2.  If we think other software systems (for example, competing hypervisor systems) are likely to be affected by the same vulnerability, we will try to make those other projects aware of the problem and include them in the advisory preparation process.
    
    (This may rely on the other project(s) having documented and responsive security contact points)
    
    3.  We will prepare or check patch(es) which fix the vulnerability. This would ideally include all relevant backports. Patches will be tightly targeted on fixing the specific security vulnerability in the smallest, simplest and most reliable way. Where necessary domain specific experts within the community will be brought in to help with patch preparation.
    4.  We will determine which systems/configurations/versions are vulnerable, and what the impact of the vulnerability is. Depending on the nature of the vulnerability this may involve sharing information about the vulnerability (in confidence, if the issue is embargoed) with hardware vendors and/or other software projects.
    5.  We will write a Xen advisory including information from (b)-(f)
4.  **Advisory pre-release:**This occurs only if the advisory is embargoed (ie, the problem is not already public):As soon as our advisory is available, we will send it, including patches, to members of the Xen security pre-disclosure list. For more information about this list, see below.In the event that we do not have a patch available two working weeks before the disclosure date, we aim to send an advisory that reflects the current state of knowledge to the Xen security pre-disclosure list. An updated advisory will be published as soon as available.
    
    At this stage the advisory will be clearly marked with the embargo date.
    
5.  **Advisory public release:**At the embargo date we will publish the advisory, and push bugfix changesets to public revision control trees.Public advisories will be posted to xen-devel, xen-users and xen-annnounce and will be added to the [Security Announcements Page](http://xenbits.xen.org/xsa/) (note that Advisories before XSA-26 were published [here](http://wiki.xenproject.org/wiki/Security_Announcements_%28Historical%29)) . Copies will also be sent to the pre-disclosure list.
6.  **Updates**If new information or better patches become available, or we discover mistakes, we may issue an amended (revision 2 or later) public advisory. This will also be sent to the pre-disclosure list.
7.  **Post embargo transparency:**During an embargo period the Security Response Team may be required to make potentially controverial decisions in private, since they cannot confer with the community without breaking the embargo. The Security Response Team will attempt to make such decisions following the guidance of this document and where necessary their own best judgement. Following the embargo period any such decisions will be disclosed to the community in the interests of transparency and to help provide guidance should a similar decision be required in the future.

## Embargo and disclosure schedule

If a vulnerability is not already public, we would like to notify significant distributors and operators of Xen so that they can prepare patched software in advance. This will help minimise the degree to which there are Xen users who are vulnerable but can’t get patches.

As discussed, we will negotiate with discoverers about disclosure schedule. Our usual starting point for that negotiation, unless there are reasons to diverge from this, would be:

1.  One working week between notification arriving at security@xenproject and the issue of our own advisory to our predisclosure list. We will use this time to gather information and prepare our advisory, including required patches.
2.  Two working weeks between issue of our advisory to our predisclosure list and publication.

When a discoverer reports a problem to us and requests longer delays than we would consider ideal, we will honour such a request if reasonable. If a discoverer wants an accelerated disclosure compared to what we would prefer, we naturally do not have the power to insist that a discoverer waits for us to be ready and will honour the date specified by the discoverer.

Naturally, if a vulnerability is being exploited in the wild we will make immediately public release of the advisory and patch(es) and expect others to do likewise.

## Pre-disclosure list

The Xen Project operates a pre-disclosure list. This list contains the email addresses (ideally, role addresses) of the security response teams for significant Xen operators and distributors.

This includes:

-   Public hosting providers;
-   Large-scale organisational users of Xen;
-   Vendors of Xen-based systems;
-   Distributors of operating systems with Xen support.

This includes both corporations and community institutions.

Here “provider”, “vendor”, and “distributor” is meant to include anyone who is making a genuine service, available to the public, whether for a fee or gratis. For projects providing a service for a fee, the rule of thumb of “genuine” is that you are offering services which people are purchasing. For gratis projects, the rule of thumb for “genuine” is measured in terms of the amount of time committed to providing the service. For instance, a software project which has 2-3 active developers, each of whom spend 3-4 hours per week doing development, is very likely to be accepted; whereas a project with a single developer who spends a few hours a month will most likey be rejected.

For organizational users, a rule of thumb is that “large scale” means an installed base of 300,000 or more Xen guests.

The list of entities on the pre-disclosure list is public. (Just the list of projects and organisations, not the actual email addresses.)

If there is an embargo, the pre-disclosure list will receive copies of the advisory and patches, with a clearly marked embargo date, as soon as they are available. The pre-disclosure list will also receive copies of public advisories when they are first issued or updated

### Handling of embargoed information

Organizations on the pre-disclosure list are expected to maintain the confidentiality of the vulnerability up to the embargo date which security@xenproject have agreed with the discoverer, and are committing to ensuring that any members/employees of that organisation who come into contact with confidential information will do so as well..

Specifically, prior to the embargo date, pre-disclosure list members should not make available, even to their own customers and partners:

-   the Xen Project advisory
-   their own advisory
-   the impact, scope, set of vulnerable systems or the nature of the vulnerability
-   revision control commits which are a fix for the problem
-   patched software (even in binary form)

without prior consultation with security@xenproject.

List members are allowed to make available to their users only the following:

-   The existance of an issue
-   The assigned XSA number
-   The planned disclosure date

List members may, if (and only if) the Security Team grants permission, deploy fixed versions during the embargo. Permission for deployment, and any restrictions, will be stated in the embargoed advisory text.

The Security Team will normally permit such deployment, even for systems where VMs are managed or used by non-members of the predisclosure list. The Security Team will impose deployment restrictions only insofar as it is necessary to prevent the exposure of technicalities (for example, differences in behaviour) which present a significant risk of rediscovery of the vulnerability. Such situations are expected to be rare.

Where the list member is a service provider who intends to take disruptive action such as rebooting as part of deploying a fix: the list member’s communications to its users about the service disruption may mention that the disruption is to correct a security issue, and relate it to the public information about the issue (as listed above). This applies whether the deployment occurs during the embargo (with permission – see above) or is planned for after the end of the embargo.

_NOTE:_ Prior v2.2 of this policy (25 June 2014) it was permitted to also make available the allocated CVE number. This is no longer permitted in accordance with MITRE policy.

### Information-sharing amongst predisclosure list members

Predisclosure list members are allowed to share fixes to embargoed issues, analysis, etc., with the security teams of other list members. Technical measures must be taken to prevents non-list-member organisations, or unauthorised staff in list-member organisations, from obtaining the embargoed materials.

The Xen Project provides the mailing list `xen-security-issues-discuss@lists.xenproject<dot>org` for this purpose. List members are encouraged to use it but may share with other list members’ security teams via other channels.

The `-discuss` list’s distribution is identical to that of the primary predisclosure list `xen-security-issues`. Recipient organisations who do not wish to receive all of the traffic on -discuss should use recipient-side email filtering based on the provided `List-Id`.

The `-discuss` list is moderated by the Xen Project Security Team. Announcements of private availability of fixed versions, and technical messages about embargoed advisories, will be approved. Messages dealing with policy matters will be rejected with a reference to the Security Team contact address and/or public Xen mailing lists.

### Predisclosure list membership application process

Organisations who meet the criteria should contact `predisclosure-applications@lists.xenproject<dot>org` (which is a public [mailing list](/help/mailing-list.html#predisclosure-applications)) if they wish to receive pre-disclosure of advisories.

You must include in the e-mail:

-   The name of your organization
-   Domain name(s) which you use to provide Xen software/services
-   A brief description of why you fit the criteria
-   If not all of your products/services use Xen, a list of (some of) your products/services (or categories thereof) which do.
-   Link(s) to current public web pages, belonging to your organisation, for each of following pieces of information:
    -   Evidence of your status as a service/software provider:
    -   If you are a public hosting provider, your public rates or how to get a quote
    -   If you are a software provider, how your software can be downloaded or purchased
-   If you are an open-source project, a mailing list archive and/or version control repository, with active development
-   Evidence of your status as a user/distributor of Xen:
    -   Statements about, or descriptions of, your eligible production services or released software, from which it is immediately evident that they use Xen.
-   Information about your handling of security problems:
    -   Your invitation to members of the public, who discover security problems with your products/services, to report them in confidence to you;
    -   Specifically, the contact information (email addresses or other contact instructions) which such a member of the public should use.

Blog postings, conference presentations, social media pages, Flash presentations, videos, sites which require registration, anything password-protected, etc., are not acceptable. PDFs of reasonable size are acceptable so long as the URL you provide is of a ordinary HTML page providing a link to the PDF.

If the pages are long and/or PDFs are involved, your email should say which part of the pages and documents are relevant.

-   A statement to the effect that you have read this policy and agree to abide by the terms for inclusion in the list, specifically the requirements to regarding confidentiality during an embargo period
-   The single (non-personal) email alias you wish added to the predisclosure list.

Your application will be determined by the Xen Project Security Team, and their decision posted to the list. The Security Team has no discretion to accept applications which do not provide all of the information required above.

If you are dissatisfied with the Security Team’s decision you may appeal it via the Xen Project’s governance processes.

Organisations should not request subscription via the mailing list web interface. Any such subscription requests will be rejected and ignored.

A role address (such as security@example.com) should be used for each organisation, rather than one or more individual’s direct email address. This helps to ensure that changes of personnel do not end up effectively dropping an organisation from the list.

### Organizations on the pre-disclosure list:

This is a list of organisations on the pre-disclosure list (not email addresses or internal business groups).

-   1 & 1 Internet AG
-   AIS, Inc
-   Alibaba Inc.
-   All Simple Internet Services
-   Amazon
-   BetaForce Networks / LLC DBA vNucleus
-   BitDefender SRL
-   BitFolk Ltd
-   Bromium Inc.
-   CentOS
-   ChunkHost
-   CloudLinux Inc.
-   CloudVPS
-   Citrix
-   Debian
-   DornerWorks Ltd
-   drServer.net
-   eApps Hosting
-   File Sanctuary
-   FXVM.net
-   Gandi.net
-   Gaiacom, LC
-   Gentoo Linux
-   GoGrid.com
-   Gossamer Threads Inc
-   HostPapa
-   Host Europe Group (HEG.com)
-   Host Virtual Inc.
-   Huawei Technologies Co. Ltd
-   Inception Hosting Ltd
-   Invisible Things Lab
-   iWeb Technologies Inc.
-   Jump Networks Ltd
-   LFCHosting.com
-   LiquidWeb.com
-   Locaweb
-   Mageia
-   mammoth.net.au
-   M.D.G. IT PTY LTD
-   Memset
-   Namecheap Inc
-   NFOServers.com
-   Novell
-   OnApp.com / SolusVM.com
-   OnePoundWebHosting Ltd
-   Openminds BVBA
-   Oracle
-   OrionVM.com
-   Public Access Networks Corp. (Panix.com)
-   prgmr.com
-   Qihoo 360 Technology Co. Ltd.
-   Rackspace
-   RailsMachine.com
-   Rimuhosting Ltd
-   Redhat
-   SecureAX Pte Ltd
-   Serversaurus
-   SiteHost
-   SoftLayer
-   Star Lab
-   Steadfast.net
-   SSDNodes.com
-   SuSE
-   The Cloud Simplified (Xperience Group)
-   The NetBSD Foundation, LLC
-   Tranquil Hosting, Inc.
-   Ubuntu
-   Wavecon GmbH
-   Xen Made Easy
-   Xen Security Response Team
-   XCP-ng.org
-   Vollmar.net GmbH
-   Zynga
-   Zynstra
-   ZZ Servers

## Change History

-   **v3.23 Aug 8th 2019:** Added DornerWorks Ltd
-   **v3.22 Aug 6th 2019:** Remove Linode
-   **v3.21 Nov 19th 2018:** Added XCP-ng.org
-   **v3.20 June 14th 2018:** Added Star Lab
-   **v3.19 May 9th 2018:** Remove Google and Xen 3.4 stable tree maintainer from the predisclosure list
-   **v3.18 April 27th 2018:** Added reference to SUPPORT.md
-   **v3.17 July 20th 2017:** Added Zynstra
-   **v3.16 April 21st 2017:** Added HostPapa
-   **v3.15 March 21st 2017:** Added CloudVPS (Feb 13) and BitDefender SRL (March 21) to the predisclosure list
-   **v3.14 Nov 30th 2016:** Added FXVM.net to the predisclosure list
-   **v3.13 May 12th 2016:** Added Serversaurus (Nov 17), The NetBSD Foundation (Dec 11), LLC and CloudLinux Inc. (May 12) to the predisclosure list
-   **v3.12 Oct 21st 2015:** Added missing years to release history. Added the following orgs to the predisclosure list: Qihoo 360 Technology Co. Ltd. (Aug 3rd), AIS Inc (Oct 20) and M.D.G. IT PTY LTD (Oct 21)
-   **v3.11 July 2nd 2015:** Added Huawei Technologies Co. Ltd to the predisclosure list
-   **v3.10 June 9th 2015:** Added 3rd paragraph to section “4. Advisory pre-release” as per the following [vote](http://lists.xenproject.org/archives/html/xen-devel/2015-06/msg01202.html) to amend the process. Added Sitehost to the predisclosure list
-   **v3.9 June 2nd 2015:** Added Jump Networks Ltd to predisclosure list and fixed rendering/numbering issue in html leading to duplicate numbering
-   **v3.8 May 13th 2015:** Removed Intel after list membership review on the basis of 3.d) of this process
-   **v3.7 May 12th 2015:** “Information-sharing amongst predisclosure list members” is now live; removed statements that this is not so
-   **v3.6 Apr 15th 2015:** Added Vollmar.net GmbH to the predisclosure list
-   **v3.5 Mar 19th 2015:** Added Bromium Inc to the predisclosure list
-   **v3.4 Mar 13th 2015:** Added Wavecon GmbH to the predisclosure list
-   **v3.3 Mar 10th 2015:** Added Openminds BVBA, Public Access Networks Corp. (Panix.com), BetaForce Networks / LLC DBA vNucleus and Gentoo Linux to the predisclosure list
-   **v3.2 Mar 4th 2015:** Added Google, Gossamer Threads Inc. and Locaweb to the predisclosure list
-   **v3.1 Mar 3rd 2015:** Added ChunkHost and Rimuhosting Ltd to the predisclosure list
-   **v3.0 Feb** 11th **2015 (published March** 2nd **2015):** New predisclosure list application process and information-sharing and -handling rules; and, minor clarifications.
-   **v2.9 Dec 12th 2014:** Added The Cloud Simplified (Xperience Group)
-   **v2.8 Nov 3rd 2014:** Added Host Europe Group (HEG.com)
-   **v2.7 Oct 21st 2014:** Added the following vendors to the pre-disclosure list: OnePoundWebHosting Ltd, File Sanctuary, iWeb Technologies Inc., Memset
-   **v2.6 Oct 1st 2014:** Added the following vendors to the pre-disclosure list: eApps Hosting, Namecheap Inc, Gaiacom, LC
-   **v2.5 Sept 30th 2014:** Added the following vendors to the pre-disclosure list: 1 & 1 Internet AG, Alibaba Inc., All Simple Internet Services, BitFolk Ltd, drServer.net, Inception Hosting Ltd, LiquidWeb.com, RailsMachine.com, SecureAX Pte Ltd, Steadfast.net, Tranquil Hosting, Inc, Zynga and ZZ Servers
-   **v2.4 Sept 29th 2014:** Added the following vendors to the pre-disclosure list: mammoth.net.au, NFOServers.com, LFCHosting.com, OrionVM.com, SoftLayer and SSDnodes.com
-   **v2.3 Sept 26th 2014:** Added the following vendors to the pre-disclosure list: Host Virtual Inc., Gandi.net, GoGrid.com, OnApp.com / SolusVM.com and prgmr.com
-   **v2.2 Jun 2014:** In accordance with MITRE’s guidelines it is no longer permissible to share CVE numbers of embargoed issues
-   **v2.1 Jun 2013:** Added Xen Made Easy
-   **v2.0 May 2013:** Significant changes to the document
    -   Expand eligibility of who can join the predisclosure list
    -   Clarify definitions of who can join the predisclosure list
    -   Clarify information that needs to be supplied when joining the predisclosure list
    -   Change e-mail alias to security@xenproject
-   **v1.6 Apr 2013:** Added Mageia to predisclosure list
-   **v1.5 Nov 2012:** Added Invisible Things Lab to pre-disclosure list
-   **v1.4 Oct 2012:** Various minor updates
-   **v1.3 Sept 2012:** Added CentOS to pre-disclosure list
-   **v1.2 Apr 2012:** Added pre-disclosure list
-   **v1.1 Feb 2012:** Added link to Security Announcements wiki page
-   **v1.0 Dec 2011:** Intial document published after review


{{</section>}}