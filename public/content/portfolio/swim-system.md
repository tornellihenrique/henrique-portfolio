---
title: Swim — Water Volumes, Buoyancy & Movement (Replicated)
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "Buoyancy", "Animation", "Internal"]
year: 2023
cover: content/portfolio/swim-system/cover.jpg
---

# Overview
Replicated **swim** feature with custom **water volumes**, **buoyancy helper**, and horizontal/vertical swim controls. Integrated with ALS-style rotation, with dedicated animation instance logic and demo level.

## Responsibilities
- SwimComponent, interfaces (character & volumes), SwimAnimationInstance tick integration.
- Enter/exit water logic; over/under-water; floor/edge treatments; transitions; leg physics; turn-in-place.
- **BuoyancyHelper** actor; space/up-down controls; fixes for rotation/strifing when swimming.
- Demo map with multiple water volume classes; water-exclusion volume.

## Replication
- Iterative replication fixes (dashing/strafing interactions, gravity/falling edge cases); broad net testing.

## Origin & Reimplementation
This feature was originally **inspired by** the Marketplace asset **Swim Component** ([Marketplace Link](https://www.fab.com/listings/5344cefe-5b67-40ac-a167-e1727a79aeca)), but the shipped version here is a **full C++ rewrite** using Unreal Engine best practices. No third-party code is included - only 3D models / Animations / design ideas.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/swim-system/video.mp4" type="video/mp4" />
</video>
