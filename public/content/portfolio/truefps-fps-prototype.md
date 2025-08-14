---
title: TrueFPS — Procedural First-Person & Replicated FPS Prototype
role: Solo Developer / Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Custom AnimGraph Node", "Networking/Replication"]
year: 2023
links:
  video: https://www.youtube.com/watch?v=WImIDwkdnes
  github: https://github.com/tornellihenrique/TrueFPSSystemPlugin
cover: content/portfolio/truefps-fps-prototype/cover.jpg
---

# Overview
Prototype that became a **TrueFPS** plugin-in-progress: a custom **Animation Blueprint node** that drives first-person presentation procedurally (single-pose input), plus a minimal **replicated free-for-all** shooter (weapons, attachments, hit flow). The TrueFPS node handles **Spine Aim Offset**, **Sway**, **Recoil**, **Blocking (wall avoidance)**, and **Leaning** via configurable parameters—aiming to ship as a marketplace plugin.

**Context / Outcome:** I released it as a WIP on Patreon. One of the first supporters (now my current boss) hired me for freelance work which evolved into my full-time position.

## Responsibilities
- Designed/implemented a **custom AnimGraph node** (`FAnimNode_*`) and editor node (`UAnimGraphNode_*`) in C++.
- Built a **replicated** FPS game loop (FFA): weapon fire, damage, respawn, score.
- Implemented **modular weapon attachments** (barrels, sights, stocks, mags) affecting behavior/recoil.
- Authored first-person camera/weapon presentation **entirely procedural** from a single 1-frame pose.

## TrueFPS Node — Features
- **Input:** one pose (1-frame animation) + config struct.
- **Spine Aim Offset:** drives upper-body twist from camera delta; clamped & blended down chain.
- **Sway:** procedural spring/noise response to velocity/accel & mouse input (separate pos/rot).
- **Recoil:** impulse stack with configurable decay and view kick coupling.
- **Blocking (Wall Avoid):** weapon forward trace; offsets pose to avoid interpenetration.
- **Leaning:** roll/yaw additive with acceleration + key input bias, clamped for readability.
- **Performance:** per-bone weights; early-out when effects disabled; cache-friendly data layout.

## Networking
- **Server-authoritative fire** with client FX prediction; attachment state replicated.
- Lightweight **hit validation** (trace on server; cosmetic trails locally).

## Outcome
- Shipped as WIP to Patreon; led directly to freelance → full-time offer.
- Solidified UE C++ knowledge around **AnimGraph**, **skeletal transforms**, and **replication**.

## Media
![title](content/portfolio/truefps-fps-prototype/demo-1.gif)