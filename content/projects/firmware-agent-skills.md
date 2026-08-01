---
title: AI Agent Skills for Firmware Development
description: "Agent skills that automate the repetitive core of Android platform work: Gerrit change validation, build → flash → boot verification, and new-chip porting checklists."
weight: 2
tags:
  - ai-agent
  - firmware
  - android
---

## Problem

A large share of Android platform work is mechanical but unforgiving. Pull a
Gerrit change and verify it actually builds and behaves locally. Build an image,
flash it, and confirm the device really came up. Walk a new-chip porting
checklist where the same twenty steps happen for every SoC.

None of this is intellectually hard. All of it is long-running, easy to get
subtly wrong, and expensive when it fails silently — a flash that "succeeded"
onto a device that then boot-loops costs an hour before anyone notices.

## What I did

Encoded these loops as agent skills. The design principles matter more than the
individual scripts:

**Verify the outcome, not the exit code.** A flash step is not done because
`fastboot` returned 0; it is done when the device is confirmed booted to the
desktop. Each skill defines success as an observable end state and checks for it.

**Make every step resumable.** Firmware loops are long and fail in the middle.
Steps are idempotent where possible so a run can be resumed rather than restarted
from a clean tree.

**Keep a human at the irreversible steps.** Flashing a device and pushing to
Gerrit are gated. The agent prepares the action and reports what it is about to
do; it does not decide on its own to write to hardware or to a shared branch.

**Encode the checklist, not the conclusion.** For new-chip porting the skill
carries the ordered procedure and its checkpoints. It does not attempt to guess
platform-specific values — it surfaces the decision points to the engineer.

This is the same automation instinct as the
[provisioning work](/projects/pxe-provisioning-automation), moved up the stack
from rack deployment into firmware development itself.

## Result

The repetitive half of platform bring-up runs unattended up to the points where
a human genuinely needs to decide, and failures surface at the step that failed
rather than at the end.

**TODO:** add measured numbers — turnaround time before and after, and the
unattended success rate.

## Links

**TODO:** the implementation is internal company work and is not publishable.
This page documents the architecture and design reasoning only. If a
sanitized reference implementation is ever extracted, link it here.
