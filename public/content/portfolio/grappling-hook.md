---
title: Grappling Hook — Physics Pull & One-Handed Use (Replicated)
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "Physics Forces", "Animation State Machine", "Layered/Masked Anim", "Internal"]
year: 2023
cover: content/portfolio/grappling-hook/cover.jpg
---

# Overview
**Grappling Hook** you can throw at **any surface**. On impact the system applies a **physics-based pull** that moves the player toward the hit point. Implemented as **Components & Interfaces** only—no logic added to the Pawn/Character classes.

## Presentation & Animation
- One-handed **hooking state machine** masked on the **right arm**, so you can **keep holding/using your weapon** while grappling.
- Clean transitions in/out of hook states; compatible with existing locomotion.

## Architecture
- Hook projectile + latch logic → **apply force toward** the anchor.
- Tunables: max rope length, pull strength/curve, cancel conditions, ground snap at arrival.
- Component/Interface API keeps gameplay layer decoupled from character implementation.

## Networking
- **Replicated** launch, hit, and pull start; clients receive authoritative anchor/force state and play local animation layer.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/grappling-hook/video.mp4" type="video/mp4" />
</video>
