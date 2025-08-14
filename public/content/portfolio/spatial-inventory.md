---
title: Spatial Inventory — Replicated Grid & Component-Based Interaction
role: Solo Developer / Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replicated Subobjects", "UMG"]
year: 2022
links:
  video: https://www.youtube.com/watch?v=vCpvA-fIlDM
cover: content/portfolio/spatial-inventory/cover.jpg
---

# Overview
Prototype of a **spatial (2D grid) inventory** fully in C++ and **replicated**. Items are **replicated UObjects** owned by an inventory container and positioned/rotated freely on a 2D grid. Includes a **flexible component-based interaction system** that lets **any widget** act as the UI. A simple UMG inventory widget is provided for drag-drop and preview.

## Responsibilities
- Designed data model and replication for grid slots.
- Built a decoupled interaction layer so the UI is fully replaceable.
- Added minimal UMG for inventory (drag-drop, hover preview, invalid-placement feedback).

## Architecture (Core)
- **Items as replicated subobjects**: inventory container (actor) owns `UInventoryItem` UObjects.
  - Registered via `GetLifetimeReplicatedProps` + `ReplicateSubobjects`.
  - Items carry immutable `Size` (W,H) and runtime state `GridX, GridY, Rot`.
- **Grid model**: 2D occupancy array; rotation swaps W/H (90° steps).
  - Fast placement test on server (bounds + overlap).
  - Client draws ghost preview (valid/invalid tint).

## Interaction System
- **Component-based**: an `InteractionComponent` mediates input → domain actions (place, rotate, pickup).
- Swappable **View**: any UMG widget (or other UI) can bind to the interaction component.

## UI (Prototype)
- Drag item to grid, **snap** to cells.
- **Rotate** before drop; auto-reject with visual feedback if overlapping/out of bounds.
- Lightweight styling to serve as a reference implementation.

## Networking
- Server validates placements and updates replicated entries.
- Clients render immediate preview.
- Works in listen/dedicated setups; late joiners receive current state.

## Outcome
Solid base for future inventory systems: clean separation of **model/interaction/UI**, efficient replication, and flexible widgets. This version ships with a video showcase.
