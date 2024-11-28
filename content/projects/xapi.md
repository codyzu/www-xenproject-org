---
title: XAPI
description: The XAPI project is an enterprise ready toolstack for use with the Xen Project hypervisor
draft: false
menus:
  main:
    parent: Projects
    weight: 100
aside:
  - type: resource
    items:
      - name: "**Github project**"
        link: "https://github.com/xapi-project/xen-api"
      - name: Documentation
        link: "http://xapi-project.github.io/" 
      - name: Contribute
        link: "https://github.com/xapi-project/xen-api/blob/master/README.markdown"
      - name: Report a Bug
        link: "https://github.com/xapi-project/xen-api/issues"
keywords: "XAPI, xen API, virtualization management, xen toolstack, virtual machine management, cloud orchestration, virtualization tools, resource management, VM lifecycle management, infrastructure management"
---

{{<section>}}
  {{<media-block
    title="Enterprise-ready tools"
    media="/img/flatline/data_and_settings.svg"
    alt="Illustration of a database icon with gears and a wrench, representing data management and configuration tools."
    animate="true"
  >}}
The XAPI project is an enterprise ready toolstack for use with the Xen Project hypervisor. When used with Xen, the XAPI toolstack consolidates server workloads, enables savings in power, cooling, and management costs (contributing to environmentally sustainable computing), increases the ability to adapt to ever-changing IT environments, optimizes the use of existing hardware, and improves the level of IT reliability.
The XAPI team also develops tooling, agents and libraries that are needed to operate a XAPI-based system.
{{</media-block>}}
{{</section>}}

{{<section md="true">}}
## What is XAPI?

The Xen Project Management API (or XAPI) is:

- A Xen Project Toolstack that exposes the XAPI interface. When we refer to XAPI as a toolstack, we typically include all dependencies and components that are needed for XAPI to operate (e.g. xenopsd).
- An interface for remotely configuring and controlling virtualized guests running on a Xen-enabled host. XAPI is the core component of XenServer (previously Citrix) and XCP-ng.

XAPI adds additional functionality compared to other Xen Project toolstacks, including:

- Extending the software to cover multiple hosts
- Enhancing the VM lifecycle, including live snapshots, VM checkpointing, and VM migration
- Enabling resource pools to include live migration, auto configuration, and disaster recovery
- Allowing flexible storage and networking including integrated Open vSwitch support and storage XenMotion® live Migration (cross-pool migration, VDI migration)
- Enabling event tracking, with progress and notification
- Creating upgrade and patching capabilities
- Facilitating real-time performance monitoring and alerting
- Integrations with cloud orchestration stacks
- Built-in support and templates for Windows and Linux guests

 Management tools are available with XAPI based products and from Xen Orchestra.
{{</section>}}




{{<section>}}
  {{<media-block
    title="License"
    media="/img/flatline/coding2.svg"
    mediaPosition="right"
    alt="Illustration of hands typing code on a laptop with documents and a cup of coffee, symbolizing software development and workflow."
    animate="true"
  >}}
{{<md>}}
XAPI is licensed under the [Lesser GNU General Public License (LGPL2)](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html).
{{</md>}}
{{</media-block>}}
{{</section>}}
