---
title: HVMI
description: Explore Xen Project's Hypervisor Memory Introspection (HVMI). Learn how HVMI enhances security by providing real-time monitoring and protection for virtualized environments.
keywords: "HVMI, Hypervisor Memory Introspection, Xen Project HVMI, HVMI security, virtualized environment protection, real-time monitoring, memory introspection, VMI APIs, Xen hypervisor, KVM hypervisor, security logic, attack prevention, buffer overflow detection, heap spray prevention, code injection prevention, Bitdefender HVMI, GravityZone Hypervisor Introspection, open-source HVMI, HVMI community, HVMI development, HVMI features, HVMI use-cases"
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside: 
  - type: resource
    items:
      - name: "Github repository"
        link: https://github.com/hvmi
      - name: "Documentation"
        link: https://hvmi.readthedocs.io/
---

{{<section>}}
  {{<media-block
    title="What is HVMI?"
    media="https://xenproject.org/wp-content/uploads/sites/79/2020/07/github-hvmi-v2_Kek0TiK6.compressed.mp4"
    alt="Video of a presentation about HVMI"
  >}}
HVMI stands for Hypervisor-based Memory Introspection. The technology leverages Virtual Machine Introspection (VMI) APIs in the Xen and KVM hypervisors. By gaining introspection of the raw memory of running guest virtual machines, HVMI can apply security logic to detect and prevent the use of common attack techniques, such as buffer overflows, heap spray, code injection, and so-on.
{{</media-block>}}
{{</section>}}



{{<section>}}
  {{<media-block
    title="About us"
    media="/img/flatline/laptop-cybersecurity.svg"
    mediaPosition="right"
    alt="Illustration of a laptop with a shield and check mark icon, representing cybersecurity and data protection."
  >}}

A research and development team at Bitdefender extended the VMI APIs by working with the Xen Project and KVM Project communities. Bitdefender initially released a commercial solution known as GravityZone Hypervisor Introspection (HVI). The core components of HVI were open-sourced in mid-2020, forming the basis of the HVMI project.
The primary goal of the HVMI project is to build a community to foster development of new features and use-cases.
{{</media-block>}}
{{</section>}}

{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
    alt="Illustration of hands typing code on a laptop with documents and a cup of coffee, symbolizing software development and workflow."
  >}}
HVMI is licensed under Apache 2.0.
{{</media-block>}}
{{</section>}}