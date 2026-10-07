---
title: Open Source
description: "Merged upstream contributions: LinuxBoot and Android bootloader support for RISC-V, an SPDM key update fix in DMTF libspdm, RISC-V LLM inference kernels in llama.cpp, and systems tooling."
toc: true
---

My upstream work centers on firmware that boots servers and devices, the
protocols they use to prove what they are running, and getting software to run
well on new hardware. Everything below is merged
upstream; each item links to the change itself.

## Boot firmware

### u-root (LinuxBoot)

[u-root](https://github.com/u-root/u-root) is the Go userland that LinuxBoot
uses to replace UEFI's boot stage with Linux. I added RISC-V support to its
kexec path.

- [pkg/boot: add riscv64 kexec support](https://github.com/u-root/u-root/pull/3733)
  — `kexec_load` used to return ENOSYS on riscv64. Adds a parser for the RISC-V
  `Image` header, EFI-stub kernels included, and the riscv64 load path.
- [pkg/boot/zimage: accept a longer kernel size entry](https://github.com/u-root/u-root/pull/3735)
- [cmds/core/reboot: add reboot command](https://github.com/u-root/u-root/pull/3750)
- [integration: attach socket NICs with -netdev/-device](https://github.com/u-root/u-root/pull/3762)

### Android Generic Bootloader (AOSP libbootloader)

Fixes to the documented QEMU flows for GBL, each one a command that failed
as written on a current distribution:

- [Attach virtio-blk in riscv64 QEMU example](https://android-review.googlesource.com/c/platform/bootable/libbootloader/+/4314126)
  — the example only worked on one side of QEMU 9.0's change to default drive
  attachment; checked on QEMU 8.2 and 10.2.
- [Fix OVMF firmware path in standalone QEMU instructions](https://android-review.googlesource.com/c/platform/bootable/libbootloader/+/4313966)
- [Fix rust-gdb prebuilt path in launch_qemu_gdb.sh](https://android-review.googlesource.com/c/platform/bootable/libbootloader/+/4313967)

## Platform security

### DMTF libspdm

[libspdm](https://github.com/DMTF/libspdm) is DMTF's reference implementation
of SPDM, the protocol devices use to authenticate and establish secure sessions
with the platform.

- [Fix key update rollback for Specula cluster A.1 and A.3](https://github.com/DMTF/libspdm/pull/3816)
  — a failed `KEY_UPDATE` could leave a session with half-updated keys and no
  way back. The fix marks the backup valid before deriving new keys and rolls
  back every failure arm, with unit tests that fail against the old code.

## LLM inference on RISC-V

### llama.cpp

Matrix kernels for the SpacemiT X60's IME matrix extension:

- [ggml-cpu: add Q8_0 IME1 matrix kernel for SpacemiT X60](https://github.com/ggml-org/llama.cpp/pull/28479)
  — prefill on Qwen2.5-0.5B went from 10.7 to 95.3 tokens/s on a Milk-V
  Jupiter board.
- [ggml-cpu: conditionally add SpacemiT IME kernel sources](https://github.com/ggml-org/llama.cpp/pull/27961)

## Android kernel

Documentation fixes in the Android Common Kernel (`kernel/common`), for the
binder, dma-buf, dma-heap and UFS interfaces:

- [binder: fix kernel-doc for struct binder_priority](https://android-review.googlesource.com/c/kernel/common/+/4232024)
- [dma-buf: fix kernel-doc for dma_buf_set_name()](https://android-review.googlesource.com/c/kernel/common/+/4202123)
- [dma-heap: document the return values of the exported helpers](https://android-review.googlesource.com/c/kernel/common/+/4239342)
- [dma-heap: restore struct dma_heap kernel-doc lost in a merge](https://android-review.googlesource.com/c/kernel/common/+/4200863)
- [scsi: ufs: fix kernel-doc for the UPIU prepare helpers](https://android-review.googlesource.com/c/kernel/common/+/4232023)

## Systems tools

- **[elfuse](https://github.com/sysprog21/elfuse)** (7 merged) — runs Arm64 and
  x86-64 Linux ELF binaries on macOS. My changes bring its Linux syscall
  emulation closer to the kernel: futex refusals, `CLONE_THREAD` exit
  signalling, `AT_EMPTY_PATH`, deferred stack unmapping.
- **[codetrial](https://github.com/sysprog21/codetrial)** (6 merged) — a live
  technical interview simulator.
- **[frama-c-mcp](https://github.com/sysprog21/frama-c-mcp)** (3 merged) — an MCP
  server that gives AI agents the Frama-C formal verification tools.
- **[shecc](https://github.com/sysprog21/shecc/pull/339)** — a regression test
  for the self-hosting, educational C compiler.
- **[sse2neon](https://github.com/DLTcollab/sse2neon/pull/774)** — dropped a
  `<fenv.h>` dependency that leaked `FE_*` macros into every includer.

## Documentation

- [Operating System in 1,000 Lines](https://github.com/nuta/operating-system-in-1000-lines)
  — the [Traditional Chinese translation](https://github.com/nuta/operating-system-in-1000-lines/pull/101)
  and a [later proofreading pass](https://github.com/nuta/operating-system-in-1000-lines/pull/131).
