---
title: GitLab CI Integration
description: Learn how to integrate custom hardware test runners into the Xen Project's GitLab CI pipeline for seamless testing on every build.
keywords:
  - Xen Project
  - GitLab CI
  - CI
  - custom hardware testing
  - CI test runners
  - integrated systems testing
  - automobile manufacturers
  - hardware vendors
  - continuous integration
  - builds
  - GitLab CI runners
date: 2025-04-30T00:00:00+01:00
draft: false
menus:
  main:
    parent: Contribute
    weight: 60
scripts:
  - hardware-status.tsx
---

{{<section md="true" class="content-markdown">}}
## Xen CI on GitLab ⚙️

Xen Project’s upstream development is backed by a powerful, public GitLab CI system. It runs over 100 automated tests across multiple architectures and hardware platforms, every time new code is pushed.

But this isn’t your typical cloud CI setup.

---

### Why This Matters for You ✅

Whether you're building cloud infrastructure or deploying Xen in **industrial**, **automotive**, or **embedded systems**, validation on real hardware is critical.

With Xen’s CI system:

- You can **connect your own devices** (development boards, embedded targets, automotive platforms) directly to the test grid.
- Every commit to Xen can be **automatically tested against your hardware**, with full traceability and access to logs.
- There's **no need to pay for cloud lab time**. You can run and debug tests directly in your own environment.

This is a **key differentiator** that sets Xen apart from both open source and proprietary hypervisors.  
**You stay in control, and testing fits into your workflow, not the other way around.**

---

### What the CI Tests 🧪

Xen’s GitLab CI covers a wide range of functionality:

- **Build jobs** across Linux distributions (Debian, Fedora, Alpine, etc.)
- **Virtualization tests** using QEMU and real hardware
- **Boot tests** for Dom0, DomU, and Dom0less setups
- PCI passthrough and suspend/resume tests
- Static analysis (e.g. cppcheck, MISRA C)
- Architectures: **x86**, **ARM32**, **ARM64**, **RISC-V**, **PowerPC**

---

### Bring Your Own Hardware (BYOH) 🛠️

One of Xen's most powerful features is the ability to **connect your own hardware to the public CI grid**:

- Run GitLab Runner on a nearby host
- Connect your boards via **serial**, **TFTP**, and **PDU (power switch)**
- Add a few YAML snippets, and you're in!

This is ideal for:

- 🚗 **Automotive teams** testing ECUs or infotainment platforms
- 🏭 **Industrial users** with specialized hardware or I/O
- 📦 **Edge/IoT deployments** using Raspberry Pi, Rockchip, or custom boards

---

### Live Test Grid 📊

Here’s a real-time snapshot of the latest hardware tests running in the Xen CI system:

{{</section>}}

{{< div "hardware-grid" >}}{{</div>}}

{{<section md="true" class="content-markdown">}}

[View on GitLab](https://gitlab.com/xen-project/hardware/xen/-/pipelines)

---

## Get Involved 🤝

Want to contribute hardware or learn more?

- 💬 **Join the discussion** on [matrix](/resources/matrix/)
- 📬 **Subscribe to the [mailing lists](/resources/mailing-lists/)**
- ✉️ **Email our Community Manager**: [community.manager@xenproject.org](mailto:community.manager@xenproject.org)

We’re always happy to help you get started or connect with others using Xen in production.

{{</section>}}
