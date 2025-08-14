---
title: Grapple — Player Interactions & Assassination (Replicated)
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "IK", "Animation Montage", "Sequencer (procedural)", "Internal"]
year: 2023
cover: content/portfolio/grapple-system/cover.jpg
---

# Overview
Prototype **grapple** feature enabling contextual interactions **between players** with two actions (Primary/Secondary). There are **no gameplay restrictions** in this prototype—actions can target any `Character`. All logic lives in **Components & Interfaces**, with **no code in the Pawn/Character** classes directly.

## Behaviors
- **At ally (Primary):** grab with synced animation, hoist onto shoulder, move while crouched.
- **At ally (Secondary):** drag along the ground (carry a wounded teammate), move while crouched.
- **At enemy (Primary):** grab from behind in an assassination-style hold (arm around the neck).
- **At enemy (Secondary):** perform the **assassination** (works whether the enemy is already grabbed or not).

## Presentation & Control
- **Synced animations** for both actors; **hand IK** controls for accurate grips.
- Target receives **semi-ragdoll** on legs/arms so the body reacts physically while still playing animations (natural “weight” feel).
- Assassinations are **customizable**: play any montage or a **procedurally built Sequencer** shot; the camera path auto-aligns to the attacker/target at runtime.

## Architecture
- **Component + Interface-based** design; attach to characters to enable the feature.
- Actions drive state machines on both participants; clean entry/exit/interrupt rules.
- Configurable tuning (movement while carrying/dragging, crouch requirement, offsets).

## Networking
- Fully **replicated**: server-auth state transitions and position updates; cosmetic sync for montages/IK on clients.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/grapple-system/video.mp4" type="video/mp4" />
</video>