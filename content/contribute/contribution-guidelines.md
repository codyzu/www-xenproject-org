---
title: Contribution guidelines
description: Please adhere to the following guidelines as you participate in the Xen Project community.
date: 2024-01-14T07:07:07+01:00
draft: false
layout: content-only
menus:
  main:
    parent: Contribute
    weight: 50
---

## Introduction

We want to see people contributing to the Xen Project effort, and there are many ways to do so.

Our goal is to maintain an environment of professionalism, respect, and innovation within Xen Project development. 
Please adhere to our [Code of Conduct](TODO) in the Xen Project community.

## Contributing code

Contributions to the Xen Project are made through patches that are reviewed by the community. We do require contributors to sign contributions using the sign-off feature of the code repository, following the same approach as the Linux Kernel does (see [Developer Certificate Of Origin](TODO)).

Before submitting a patch please read the CONTRIBUTING, COPYING and CODING_STYLE files (found mostly in our git repositories).

* Each Xen Project subproject may have its own submission guidelines. Please check the [team pages](TODO) to learn more.

* Read our [Guide to submitting patches](TODO) via e-mail workflow

* Note that [XAPI](TODO), [Mirage OS](TODO) and [XCP-ng](TODO) follow a [standard Github workflow](TODO).

* Read our [Guide to asking developer questions](TODO)

You can also ask questions on the [xen-devel@lists.xenproject.org](TODO) mailing list or our [Matrix channels](TODO).

## Submitting patches to the Xen Project codebase

Please first check the submission process for the Xen Sub-Project, and send an email to the proper mailing list with [PATCH] as the first word in the subject line. Each patch should perform a single function. Patches sent to the mailing lists should be broken up into several email messages of less than 100KB each, with only one patch per email.

Please include a description of why you want the change made (not just the "what") and why it is important for the team to make this change. Your patch will need to include a [signed-off-by tag](TODO), author's name, and other information.

For details about what to include in your patch, you should start with the [patch submission documentation](TODO).

## Escalation

If you submitted a patch to the xen-devel mailing list or bugzilla and did not receive a response within 5 business days, please send an email to xen-devel and in the first line of that email, include this phrase "Patch escalation: no response for x days".

This is one case where you should "top post" to make sure that the escalation text is read.

## Code security scanning

The Xen Project is registered with the ["Coverity Scan" service](TODO) which applies Coverity's static analyser to the Open Source projects. The tool can and does find flaws in the source code which can include security issues. Currently only the Xen Project Hypervisor (i.e. xen.git) is covered by these scans. Triaging and proposing solutions for the flaws found by Coverity is a useful way in which Community members can contribute to the Xen Project.

Members of the community may request access to the Coverity database. However, Coverity requires that you create an account and apply for Xen Project membership by searching for the Xen Project and then requesting to be added to the project. We typically will approve requests within a few days, but reserve rejecting requests from accounts who never engaged with the project (aka never posted to a mailing list) or which look like spam accounts.

