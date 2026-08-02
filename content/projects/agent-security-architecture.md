---
title: AI Agent Security Architecture
description: "A PoC that moves the security boundary of an LLM agent out of the model: reasoning separated from action, least privilege per capability, complete mediation, and namespace isolation."
weight: 1
tags:
  - security
  - ai-agent
---

## Problem

An LLM agent that both decides and acts is a single trust domain. Any text it
reads — a retrieved document, a tool result, a file in the repo — is a candidate
instruction, and if the model is persuaded, the action executes with the agent's
full privileges. Prompt injection is not a bug in a particular prompt; it is the
predictable outcome of putting the decision and the capability in the same place.

The usual mitigations — input filtering, instruction hierarchies, "ignore
previous instructions" detectors — are heuristic, and they all share one
assumption: that the model is the security boundary. A model is a bad boundary.
It has no notion of a capability it cannot exercise.

## What I did

Built a proof of concept that treats the model as untrusted and puts the boundary
outside it, using four established security principles rather than model-level
defenses:

**Reasoning / action separation.** The reasoning process proposes an action; it
never holds the capability to perform one. A separate mediator decides whether
the proposal executes. Convincing the model is therefore not sufficient to cause
an effect — it only produces a request.

**Least privilege.** Each action is granted only the specific capability it
needs, scoped to that action, rather than the agent holding a standing union of
every permission it might ever need.

**Complete mediation.** Every action goes through the mediator on every
invocation. There is no cached authorization and no side path — a bypass is not
something the model can talk its way into, because no bypass is implemented.

**Namespace isolation.** Actions execute inside isolated namespaces, so a
compromised action cannot reach the host, the agent's own state, or a sibling
task's data.

## Result

The security properties stop depending on model behavior. An injected
instruction still produces a *proposal*, but the proposal is subject to the same
mediation as any other, and an action that escapes its intended scope is confined
by the namespace rather than by the model's judgment.

**TODO:** add the concrete evaluation from the writeup — which injection classes
were tested, and what the mediator rejected.

## Links

**TODO:** link the public writeup. It is not in this repository — I searched the
content tree and the full git history across all branches and found no copy, so
the URL needs to be added here by hand.
