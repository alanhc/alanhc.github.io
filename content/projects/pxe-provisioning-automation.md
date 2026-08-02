---
title: Kubernetes PXE Provisioning Automation
description: "Rack-scale ARM and x86 server validation driven by PXE OS provisioning, with the image and repository footprint cut from 663 MB to 2.4 MB."
weight: 4
tags:
  - automation
  - kubernetes
  - provisioning
---

## Problem

Validating servers at rack scale means installing an operating system on every
machine, repeatedly, across two architectures. Done by hand it is the same
sequence of steps per box, and the cost scales linearly with the size of the
rack — which makes it the first thing that breaks when the rack gets bigger.

The supporting artifacts had their own problem: the provisioning images and
repository had accumulated to 663 MB, and every rebuild and every fetch paid
that cost.

## What I did

Built a Kubernetes-based test system — kubeadm, Helm, and shell — that drives
PXE-based OS provisioning across ARM and x86 servers, covering both Windows and
Linux targets.

Getting PXE to behave across two architectures means working below the
convenient abstractions: ARP, DHCP, and TFTP are part of the workflow, not
implementation details, and the boot path differs enough between ARM and x86
that it has to be handled explicitly rather than assumed.

Separately, audited what was actually in the images and the repository, stripped
the base images down to what provisioning genuinely required, and collapsed
redundant layers.

## Result

- **663 MB → 2.4 MB** image and repository footprint — roughly a **99% reduction**
- Rack-scale validation across ARM and x86 driven by the system rather than by hand

This is the earliest piece of the automation thread that later became
[agent skills for firmware development](/projects/firmware-agent-skills) — the
same instinct to remove a repeated manual loop, applied at deployment scale
before it was applied to firmware work.

## Links

**TODO:** the work is not public. Add a link if a sanitized writeup is produced.
