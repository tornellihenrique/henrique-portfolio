---
title: Parasuit — Skydive & Parachute (Replicated)
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "Custom Locomotion Modes", "UMG", "Internal"]
year: 2023
cover: content/portfolio/parasuit/cover.jpg
---

# Overview
Replicated **skydive + parachute** system with dedicated Animation Instances, configurable settings, and UI for altitude readouts. Supports **auto-open**, **dash**, and **roll on landing**, with client-friendly **velocity prediction**.

## Responsibilities
- Components/Interfaces/AnimInstances for skydive/parachute; retargeted anims and blendspaces.
- Skydiving movement (sideways/forward), smooth rotation; parachute actor/backpack spawn & alignment.
- HUD widget: current height + ground-relative slider; movable panels.
- Settings DataAsset + integration into character movement modes.

## Replication
- Fixed replication issues; velocity prediction for local players; general net polish.

## Origin & Reimplementation
This feature was originally **inspired by** the Marketplace asset **Skydive and Parachute Kit** ([Marketplace Link](https://www.fab.com/de/listings/f22a7d81-b04f-488f-8ae4-63aeb13520c9)), but the shipped version here is a **full C++ rewrite** using Unreal Engine best practices. No third-party code is included - only 3D models / Animations / design ideas.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/parasuit/video.mp4" type="video/mp4" />
</video>
