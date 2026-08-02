---
title: Projects
description: "Selected embedded software work: agent security architecture, firmware development automation, OpenBMC debugging, provisioning at rack scale, and CPU-side LLM inference analysis."
toc: true
layout: wide
---

<div class="hx:mt-4"></div>

<p class="hx:mb-12 hx:text-center hx:text-lg hx:text-gray-500 hx:dark:text-gray-400">
Register-level firmware work, and the automation built around it.
</p>

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
