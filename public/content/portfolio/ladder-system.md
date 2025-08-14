---
title: Ladder System — Replicated Climbing & Procedural IK
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "TwoBoneIK", "Spline Meshes", "Internal"]
year: 2023
# cover: content/portfolio/ladder-system/cover.jpg
---

# Overview
Replicated ladder system with **procedural rung IK** (hands/feet), modular ladder actor built via **splines**, and a smooth **climb-from-top** flow (root-motion friendly). Includes optional **slide on ladder** and support for **pipe climbing**.

## Responsibilities
- Ladder architecture: `LadderComponent`, `Ladder` actor, `LadderCharacterInterface`, DataAsset settings.
- **Detection & flow**: auto start/stop at top/bottom, jump exit with impulse, climb-from-top volume.
- **Animation**: `LadderAnimationInstance` with Idle/Up/Down states; rung tracing → TwoBoneIK targets.
- **Authoring**: modular ladder pieces (struts/rungs) with customizable sizes/offsets via splines.
- **Tuning/Debug**: alpha smoothing to prevent teleporting; on-screen debug; settings exposure.

## Replication
- Replicates movement input/state; handles simulated proxy visuals; tested across network sessions.

## Notes
- Additional features: **dash while climbing**, **UI hint** for top-climb, **pipe climb** variant.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/ladder-system/video.mp4" type="video/mp4" />
</video>
