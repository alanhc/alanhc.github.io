---
title: Open Source
description: "Merged upstream contributions: U-Boot fixes for QEMU RISC-V, TPM and the SpacemiT K1, LinuxBoot kexec for RISC-V and Arm, Android bootloader fixes, SPDM and PLDM fixes, RISC-V LLM inference kernels in llama.cpp, Triton CPU fixes, and systems tooling."
toc: true
---

My upstream work centers on firmware that boots servers and devices, the
protocols they use to prove what they are running, and getting software to run
well on new hardware. Everything below is merged
upstream; each item links to the change itself.

## Boot firmware

### U-Boot

[U-Boot](https://source.denx.de/u-boot/u-boot) is the bootloader on most
embedded Linux boards and on QEMU's virt machines.

QEMU RISC-V now boots through standard boot, so a kernel passed with
`-kernel`, `-initrd` and `-append` boots directly when U-Boot runs from pflash:

- [riscv: qemu: Switch to standard boot](https://source.denx.de/u-boot/u-boot/-/commit/155513201d849d29b0a4e6318cb927b34613cd44)
- [cmd: Enable qfw by default on QEMU RISC-V](https://source.denx.de/u-boot/u-boot/-/commit/320f8ddfe6f1b1f67ad18b96f2009a4c6a0fc22a)
- [riscv: qemu: Do not disable initrd relocation](https://source.denx.de/u-boot/u-boot/-/commit/34108d339f4a357c2456727805f09c4d16a01bbc)
- [doc: qemu-riscv: Describe booting a kernel through fw_cfg](https://source.denx.de/u-boot/u-boot/-/commit/77d5b1f9fbdb80e49c87a38c401b2cf2ca73c509)

TPM:

- [tpm: Fix the size of the random data in tpm2_get_random()](https://source.denx.de/u-boot/u-boot/-/commit/5f6a4efb1842cb5d3193cd17bebc29748e106f71)
  — a u32 was filled through a u16 pointer, so the TPM RNG failed whenever the
  stale upper half was not zero, breaking the kaslr-seed fixup on every
  `bootefi`.

SpacemiT K1, on the Milk-V Jupiter:

- [spacemit: k1: drop the CS1 DRAM map on single-rank boards](https://source.denx.de/u-boot/u-boot/-/commit/e6308cc144db417258e608b6102e3190aa9ab505)
  — a 4 GiB board was reported as 8 GiB, so U-Boot reserved memory past the
  end of DRAM and passed 8 GiB to Linux.
- [spacemit: k1: initialise the EEPROM index in read_ddr_info()](https://source.denx.de/u-boot/u-boot/-/commit/7009e73cafc88773a502be8a94713d81ec3d0516)
- [configs: k1: enable GigaDevice SPI NOR flash support](https://source.denx.de/u-boot/u-boot/-/commit/f1fd97b340b601ab684c2e206d9ffa18dbab8322)

### u-root (LinuxBoot)

[u-root](https://github.com/u-root/u-root) is the Go userland that LinuxBoot
uses to replace UEFI's boot stage with Linux. I added RISC-V and 32-bit Arm
support to its kexec path.

- [pkg/boot: add riscv64 kexec support](https://github.com/u-root/u-root/pull/3733)
  — `kexec_load` used to return ENOSYS on riscv64. Adds a parser for the RISC-V
  `Image` header, EFI-stub kernels included, and the riscv64 load path.
- [pkg/boot: add arm kexec support](https://github.com/u-root/u-root/pull/3814)
  — tested on a BeagleBone Black, which kexecs from one kernel into another
  and boots to a login prompt.
- [pkg/boot/kexec: honour #address-cells and #size-cells in the FDT memory map](https://github.com/u-root/u-root/pull/3813)
  — device trees with 32-bit cells, as on 32-bit Arm, could not be read at all.
- [integration: run kexec_load tests on riscv64](https://github.com/u-root/u-root/pull/3761)
- [kexec: explain kexec_file_load failures](https://github.com/u-root/u-root/pull/3774)
- [bootcmd: show the menu again when the shell exits](https://github.com/u-root/u-root/pull/3805)
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
- [Assert the exact key update callback sequence in KEY_UPDATE tests](https://github.com/DMTF/libspdm/pull/4087)

### OpenPRoT pldm-lib

[pldm-lib](https://github.com/OpenPRoT/pldm-lib) is OpenPRoT's Rust
implementation of PLDM, the protocol a platform root of trust uses for firmware
updates and device management. My changes make its decoders safe against
malformed messages from a peer:

- [pldm-common: bound wire version-string lengths by the destination](https://github.com/OpenPRoT/pldm-lib/pull/21)
- [pldm-common: bound descriptor and downstream string lengths](https://github.com/OpenPRoT/pldm-lib/pull/33)
  — with a test that feeds all 20 decoders malformed buffers and fails if any
  of them panics.
- [pldm-interface: answer requests that fail to decode](https://github.com/OpenPRoT/pldm-lib/pull/32)
  — fifteen request handlers sent no response at all, leaving the update agent
  waiting for its timeout.

## LLM inference on RISC-V

### llama.cpp

Matrix kernels for the SpacemiT X60's IME matrix extension:

- [ggml-cpu: add Q8_0 IME1 matrix kernel for SpacemiT X60](https://github.com/ggml-org/llama.cpp/pull/28479)
  — prefill on Qwen2.5-0.5B went from 10.7 to 95.3 tokens/s on a Milk-V
  Jupiter board.
- [ggml-cpu: conditionally add SpacemiT IME kernel sources](https://github.com/ggml-org/llama.cpp/pull/27961)

## Triton CPU backend

[triton-cpu](https://github.com/triton-lang/triton-cpu) compiles Triton GPU
kernels for CPUs:

- [Round fp32 to bf16 to nearest even without native support](https://github.com/triton-lang/triton-cpu/pull/330)
  — on x86 without `avx512bf16`, the conversion truncated, and about half of
  the elements in the bf16 tests came out wrong.
- [Enable 43 more test_core.py tests on the CPU backend](https://github.com/triton-lang/triton-cpu/pull/324)
- [Honor the mask in tl.histogram](https://github.com/triton-lang/triton-cpu/pull/329)

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
- **[sse2neon](https://github.com/DLTcollab/sse2neon)** — dropped a
  [`<fenv.h>` dependency](https://github.com/DLTcollab/sse2neon/pull/774) that
  leaked `FE_*` macros into every includer, and added an
  [SVE2 fast path](https://github.com/DLTcollab/sse2neon/pull/773) for the
  string compare EQUAL_ANY mode.
- **[UCAgent](https://github.com/XS-MLVP/UCAgent)** (2 merged) — a CI workflow
  that runs the unit tests on pull requests, and skill scripts run with the
  Python that runs UCAgent instead of whichever is first on `PATH`.

## Documentation

- [Operating System in 1,000 Lines](https://github.com/nuta/operating-system-in-1000-lines)
  — the [Traditional Chinese translation](https://github.com/nuta/operating-system-in-1000-lines/pull/101)
  and a [later proofreading pass](https://github.com/nuta/operating-system-in-1000-lines/pull/131).
