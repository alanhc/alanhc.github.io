---
title: OpenBMC Firmware Debugging Workflow
description: "Cross-machine debugging of production BMC firmware using gdbserver, live-attach to running daemons, and core dump analysis. Presented at COSCUP 2025."
weight: 3
tags:
  - openbmc
  - firmware
  - debugging
---

## Problem

BMC firmware bugs live on the machine, not on your desk. The BMC is a constrained
ARM SoC on a production server platform — there is no room to run a debugger and
a toolchain on it, and the interesting failures are the ones that only reproduce
on real hardware, under real load, in the state the machine is already in.

The default response to that is printf and redeploy: add a log line, rebuild the
Yocto image, reflash, wait, hope the failure recurs. Each iteration costs a full
build-and-flash cycle, and restarting the daemon to attach a debugger destroys
the exact state you were trying to inspect.

## What I did

Set up a cross-debugging workflow that puts a real debugger on the failing
process without moving it off the machine:

**gdbserver on target, toolchain on host.** The BMC runs only the stub; the
cross-GDB, the symbols, and the sysroot stay on the development host. This
requires the host sysroot to match the deployed Yocto image exactly — mismatched
symbols are worse than no symbols, because they are confidently wrong.

**Live-attach to a running daemon.** Attach to the process in its current state
instead of restarting it under a debugger. For failures that take hours to
manifest, or that depend on accumulated state, this is the difference between
investigating the bug and being unable to reach it.

**Core dump analysis.** For crashes that cannot be caught interactively, collect
the dump from the target and analyze it against matching symbols on the host,
so a one-shot crash still yields a stack.

## Result

Turned BMC debugging from rebuild-and-guess into attaching to the actual failing
process on the actual machine — the interactive path for reproducible failures,
the core dump path for the ones that only happen once.

I presented this workflow at **COSCUP 2025**, and the slide deck is published
below.

**TODO:** add a concrete number — iteration time before and after, or a bug that
was only findable this way.

## Links

- [Using GDB Debug in OpenBMC — COSCUP 2025](https://web.archive.org/web/20250703021811/https://pretalx.coscup.org/coscup-2025/talk/EXYUKY/)
- [Slides: OpenBMC Cross-Debugging with GDB (PDF)](/OpenBMC%20Cross-Debugging%20with%20GDB.pdf)
