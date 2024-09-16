---
title: HVMI
description: Explore Xen Project's Hypervisor Memory Introspection (HVMI). Learn how HVMI enhances security by providing real-time monitoring and protection for virtualized environments.
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside: 
  - type: resource
    items:
    - name: "**Github repository**"
      link: TODO
    - name: Documentation
      link: TODO
---

{{<section>}}
  {{<media-block
    title="What is HVMI?"
    media="https://xenproject.org/wp-content/uploads/sites/79/2020/07/github-hvmi-v2_Kek0TiK6.compressed.mp4"
  >}}
HVMI stands for Hypervisor-based Memory Introspection. The technology leverages Virtual Machine Introspection (VMI) APIs in the Xen and KVM hypervisors. By gaining introspection of the raw memory of running guest virtual machines, HVMI can apply security logic to detect and prevent the use of common attack techniques, such as buffer overflows, heap spray, code injection, and so-on.
{{</media-block>}}
{{</section>}}



{{<section>}}
  {{<media-block
    title="About us"
    media="/img/flatline/laptop-cybersecurity.svg"
    mediaPosition="right"
  >}}

A research and development team at Bitdefender extended the VMI APIs by working with the Xen Project and KVM Project communities. Bitdefender initially released a commercial solution known as GravityZone Hypervisor Introspection (HVI). The core components of HVI were open-sourced in mid-2020, forming the basis of the HVMI project.
The primary goal of the HVMI project is to build a community to foster development of new features and use-cases.
{{</media-block>}}
{{</section>}}

{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
  >}}
HVMI is licensed under Apache 2.0.
{{</media-block>}}
{{</section>}}