---
title: CPU-Side Low-Bit LLM Inference Analysis
description: "Profiling T-MAC and BitNet low-bit inference on CPU with perf and uftrace — IPC, cache and TLB misses, page faults — to locate the real bottlenecks."
weight: 5
tags:
  - performance
  - llm
  - profiling
---

## Problem

Low-bit inference kernels like T-MAC and BitNet promise that quantized LLMs can
run usefully on CPUs. The published evidence for that is mostly throughput:
tokens per second, on some machine, against some baseline.

Throughput tells you whether something got faster. It does not tell you *why*,
and it does not tell you what to fix next. A kernel that is bound on memory
behavior and one that is bound on instruction issue produce the same
tokens-per-second number and demand completely different optimizations. Guessing
which one you have is how optimization effort gets spent in the wrong place.

## What I did

Profiled the inference path on CPU with `perf` and `uftrace`, measuring the
hardware behavior rather than the wall clock:

- **IPC** — whether the core is issuing work or stalled
- **Cache misses** — whether the working set and access pattern fit the hierarchy
- **TLB misses** — whether address translation is itself a cost, which low-bit
  layouts can provoke by trading memory footprint for irregular access
- **Page faults** — whether time is going to the memory system rather than compute

`uftrace` gave the function-level call path so the hardware counters could be
attributed to specific stages rather than to the process as a whole.

## Result

Located where the time actually goes in the low-bit inference path on CPU, and
identified concrete optimization targets on that evidence rather than on
assumption about which layer "should" be slow.

**TODO:** publish the measured numbers — the counter deltas per stage, and which
targets they pointed to.

## Links

- [T-MAC](https://github.com/microsoft/T-MAC)
- [BitNet](https://github.com/microsoft/BitNet)

**TODO:** link the analysis writeup once published.
