---
title: Alan Tseng
toc: true
description: "Embedded software engineer using AI agents to speed up firmware development. Register-level driver and debugging work on OpenBMC servers, platform and automation work on Android — three platform stacks in two years."
---

I'm an embedded software engineer who uses AI agents to make firmware work go
faster.

Rack provisioning at Pegatron, OpenBMC firmware at Wiwynn, Android platform work
at MediaTek — three platforms in two years, each with its own toolchain, its own
debugger, and its own definition of "it booted". I don't think that's a scattered
résumé; I think getting productive on unfamiliar hardware quickly is the skill,
and I've had to do it repeatedly rather than talk about it.

The deepest register-level work is on the server side: I2C/PMBus drivers, device
tree, and cross-machine debugging with gdbserver, live-attach and core dumps,
which I presented at COSCUP 2025. On the Android side the leverage has been
automation — agent skills that take the repetitive half of platform work off the
critical path.

That automation instinct isn't new. It started with rack-scale provisioning and
has since moved up into firmware development itself.

## Selected Projects

{{< cards >}}
  {{< card
        link="/projects/agent-security-architecture"
        title="AI Agent Security Architecture"
        subtitle="Moving an agent's security boundary out of the model: reasoning separated from action, least privilege, complete mediation, namespace isolation."
  >}}
  {{< card
        link="/projects/firmware-agent-skills"
        title="AI Agent Skills for Firmware Development"
        subtitle="Automating the repetitive core of Android platform work — Gerrit change validation, build → flash → boot verification, new-chip porting."
  >}}
  {{< card
        link="/projects/openbmc-debugging-workflow"
        title="OpenBMC Firmware Debugging Workflow"
        subtitle="Cross-machine debugging of production BMCs with gdbserver, live-attach, and core dump analysis. Presented at COSCUP 2025."
  >}}
  {{< card
        link="/projects/pxe-provisioning-automation"
        title="Kubernetes PXE Provisioning Automation"
        subtitle="Rack-scale ARM and x86 server validation. Image and repository footprint cut from 663 MB to 2.4 MB — about 99%."
  >}}
  {{< card
        link="/projects/low-bit-llm-inference-analysis"
        title="CPU-Side Low-Bit LLM Inference Analysis"
        subtitle="Profiling T-MAC and BitNet with perf and uftrace — IPC, cache and TLB misses, page faults — to find the real bottlenecks."
  >}}
{{< /cards >}}

## Talks

| Date | Title | Where |
|------|-------|-------|
| 2026 | [Firmware Development with Agentic AI: Let the AI Run the Build, You Solve the Hard Problems](https://coscup.org/2026/session/TEDPF3/) <br><small>韌體開發與 Agentic AI：讓 AI 跑 Build，你來解難題</small> | COSCUP — Taiwan |
| 2025 | [Using GDB Debug in OpenBMC](https://web.archive.org/web/20250703021811/https://pretalx.coscup.org/coscup-2025/talk/EXYUKY/) | COSCUP — Taiwan |

## Experience

{{% steps %}}

### Embedded Software Engineer @ MediaTek
_MediaTek Corporation, 2025 – Present_

Android platform work. Built AI agent skills that automate the repetitive half
of the job — pulling Gerrit changes and validating them locally, driving
build → flash → boot verification, and walking new-chip porting checklists.

### Embedded Software Engineer @ Wiwynn
_Wiwynn Corporation, Dec 2024 – Sep 2025 · BMC Firmware_

OpenBMC firmware on hyperscaler server platforms — C/C++ drivers over I2C/PMBus,
Yocto builds, and the D-Bus/systemd services above them. Debugged production BMCs
across machines with gdbserver, live-attach, and core dump analysis, and shared
that workflow at COSCUP 2025.

### Software Engineer @ Pegatron
_Pegatron Corporation, Sep 2024 – Dec 2024 · Server Validation_

Automated rack-scale server validation: a Kubernetes-based test system driving
PXE OS provisioning across ARM and x86 servers, down at the ARP/DHCP/TFTP layer.
Cut the image and repository footprint from 663 MB to 2.4 MB — about 99% — by
stripping base images and collapsing redundant layers. This is where the
automation thread starts.

### Software Engineer Intern @ LINE
_LINE Corporation, Jul 2022 – Nov 2022_

Built an internal tool that generated type definitions and backend API bindings
from Swagger as a single source of truth, cutting API development time by 20%.
Deployed it on Kubernetes with DNS and load balancing.

{{% /steps %}}

## Education

{{% steps %}}

### M.Sc., Computer Science @ NTU
_National Taiwan University, 2024_

{{% /steps %}}

## Explore

{{< cards >}}
  {{< card link="/projects" title="Projects" icon="collection" >}}
  {{< card link="/blog" title="Blog" icon="book-open" >}}
  {{< card link="/notes" title="Notes" icon="book-open" >}}
  {{< card link="/docs" title="Engineering Notes" icon="book-open" >}}
  {{< card link="https://alanhc.github.io/til/" title="TIL ↗" icon="book-open" >}}
  {{< card link="/about" title="About" icon="user" >}}
{{< /cards >}}
