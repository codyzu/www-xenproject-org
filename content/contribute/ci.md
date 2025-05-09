---
title: Continuous Integration
description: Learn how to integrate custom hardware test runners into the Xen Project's GitLab CI pipeline for seamless testing on every build.
keywords:
  - Xen Project
  - GitLab CI
  - Cirrus CI
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
# GitLab CI: The Primary Test Infrastructure for Xen

The Xen Project relies on GitLab CI as its primary test infrastructure, enabling continuous integration and validation across a wide range of hardware and software configurations. This system ensures that every change to Xen is thoroughly tested, helping maintain quality and stability. Explore how it works, what tests are run, and how you can contribute or integrate your own hardware into the testing grid.
{{</section>}}

{{<section md="true" class="section-square-rounded">}}
### Unlike anything else...
\
🚀 Unlike most open source projects, Xen CI lets you:
- 🛠️ [Run tests on your own hardware](#bring-your-own-hardware-byoh-) from your own lab
- 📡 See [live public results](#-live-test-grid-see-xen-ci-in-action) from the global test grid

This level of transparency and extensibility is practically unheard of in other hypervisor projects.
{{</section>}}

{{<section class="content-markdown">}}
{{<md>}}
## 🌐 Live Test Grid: See Xen CI in Action

Want proof? Here's a real-time view of Xen running on real boards across our global test grid:
{{</md>}}
{{</section>}}

{{< div "hardware-grid" >}}{{</div>}}

{{<section md="true" class="content-markdown">}}
## Why This Matters for You ✅

Whether you're building cloud infrastructure or deploying Xen in **industrial**, **automotive**, or **embedded systems**, validation on real hardware is critical.

With Xen’s CI system:

- You can **connect your own devices** (development boards, embedded targets, automotive platforms) directly to the test grid
- Every commit to Xen can be **automatically tested against your hardware**, with full traceability and access to logs
- There's **no need to pay for cloud lab time**. You can run and debug tests directly in your own environment

This is a **key differentiator** that sets Xen apart from both open source and proprietary hypervisors.  
**You stay in control, and testing fits into your workflow, not the other way around.**
{{</section>}}

{{<section>}}
{{<media-block
  media="/img/flatline/data_and_settings.svg"
  alt="Xen Project GitLab CI"
  animate="true"
>}}
{{<md>}}
## What is GitLab CI?

Xen Project’s upstream development is backed by a powerful, public GitLab CI system. It runs over 100 automated tests across multiple architectures and hardware platforms, every time new code is pushed.

But this isn’t your typical cloud CI setup...
{{</md>}}
{{</media-block>}}
{{</section>}}

{{<section>}}
{{<media-block
  title="Xen Project GitLab CI"
  media="https://www.youtube.com/embed/9_DV_KZ3d9M"
  alt="Xen Project GitLab CI"
  animate="true"
  mediaPosition="right"
>}}
{{<md>}}
### 🎥 Watch: GitLab CI in Action at Xen Summit

Want a deeper dive into how Xen’s CI works? Check out this talk from the 2023 Xen Developer & Design Summit
{{</md>}}
{{</media-block>}}
{{</section>}}

{{<section>}}
{{<media-block
  media="{{< diagram-ci >}}"
  alt="Xen Project GitLab CI"
  animate="true"
  mediaPosition="right"
>}}
{{<md>}}
## CI Workflow Overview

Xen’s GitLab CI system orchestrates build and test jobs across various environments to ensure code quality and hardware compatibility.
{{</md>}}

{{<icon-button href="https://gitlab.com/xen-project/hardware/xen/-/pipelines">}}View on GitLab{{</icon-button>}}

{{<md>}}
\
Every CI pipeline starts by building Xen across a wide range of Linux distributions. Here’s how that works.

## Build Jobs

Xen’s GitLab CI includes build jobs across multiple Linux distributions such as Debian, Fedora, and Alpine, ensuring compatibility and successful builds in diverse environments.

## Test Jobs

To validate the builds, Xen's GitLab CI includes test jobs that fall into 2 categories: QEMU and Hardware.

### QEMU

Most tests are performed using QEMU emulation, allowing rapid validation of Xen features in an emulated environment.

### Hardware

Real hardware tests cover booting Dom0, DomU, and Dom0less setups, PCI passthrough, suspend/resume functionality, and static analysis tools like cppcheck and MISRA C.

{{</md>}}
{{</media-block>}}
{{</section>}}

{{<section md="true" class="content-markdown">}}
Wondering how the virtual and hardware tests compare? Here’s a side-by-side look.

## QEMU vs Hardware: How They Differ 🔍

Xen CI supports both emulated test environments and real hardware validation. Here's a quick side-by-side look at how QEMU-based and hardware-based test jobs differ:
{{</section>}}

{{<section class="container">}}
<div class="uno-flex uno-flex-col lg:uno-flex-row uno-gap-12 uno-justify-center uno-mt-6">
  <div class="uno-opacity-0 uno-animate-fill-forwards" data-uno-animate="uno-animate-fade-in-left-short">
    {{< diagram-test-qemu >}}
  </div>
  <div class="uno-opacity-0 uno-animate-fill-forwards" data-uno-animate="uno-animate-fade-in-right-short">
    {{< diagram-test-hardware >}}
  </div>
</div>
{{</section>}}

{{<section md="true" class="content-markdown">}}
## Test Coverage Highlights

Xen CI covers a wide range of scenarios to ensure high-quality releases across diverse environments:

- ✅ Architectures: **x86**, **ARM32**, **ARM64**, **RISC-V**, **PowerPC**
- 🔁 Features: Dom0 boot, DomU launch, Dom0less, suspend/resume, PCI passthrough
- 🧪 Tools: Static analysis with **cppcheck**, **MISRA C**, and more
- 🧩 Environments: QEMU virtualized tests and real baremetal boards
- 🧷 OS coverage: Debian, Fedora, Alpine, and FreeBSD (via Cirrus-CI)

> Additional testing is also performed on [Cirrus-CI](https://cirrus-ci.com/github/xen-project/xen) for [FreeBSD](http://freebsd.org/) builds using a full [LLVM](http://llvm.org/) based toolchain.

## Bring Your Own Hardware (BYOH) 🛠️

One of Xen's most powerful features is the ability to **connect your own hardware to the public CI grid**:

- Run GitLab Runner on a nearby host
- Connect your boards via **serial**, **TFTP**, and **PDU (power switch)**
- Add a few YAML snippets, and you're in!

This is ideal for:

- 🚗 **Automotive teams** testing ECUs or infotainment platforms
- 🏭 **Industrial users** with specialized hardware or I/O
- 📦 **Edge/IoT deployments** using Raspberry Pi, Rockchip, or custom boards

{{</section>}}

{{<section class="section-square-primary">}}
{{<md>}}
## Get Involved 🤝

Want to test Xen on your own hardware? Want to learn more?

- 💬 **Join the discussion** on [matrix](/resources/matrix/)
- 📬 **Subscribe to the [mailing lists](/resources/mailing-lists/)**
- ✉️ **Email our Community Manager**: [community.manager@xenproject.org](mailto:community.manager@xenproject.org)

We’re always happy to help you get started or connect with others using Xen in production.
{{</md>}}
{{</section>}}
