---
title: Cover System — Lean, Corners & Auto-Cover (Replicated)
role: Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "Line Trace", "Motion Warping", "UMG", "Internal"]
year: 2023
cover: content/portfolio/cover-system/cover.jpg
---

# Overview
Replicated **cover** with trace-based detection, **corner handling**, and **leaning** (manual/auto). Supports **auto-cover**, shoulder toggling, forward spine bend, and **cover change** with Motion Warping, roll, or auto-walk. Includes an animated interaction widget.

## Responsibilities
- Component/Interface/AnimInstance for cover; start/stop cover, angle/low-object detection.
- Leaning via Control Rig; lock turn-in-place; directional leaning toward wall; shoulder swap logic.
- Corner detection with auto-lean & position offsets; cover run; curved cover handling; walk-side by look dir.
- Cover change across nearby covers with three movement types (MW montage / roll / auto-walk).
- DataAsset settings; numerous logic/replication fixes; polished forward-lean configuration.

## Replication
- Removed unnecessary replicated vars; replicated actions properly; integrated with view-rotation replication.
- Auto-cover + movement during cover replicated consistently; interaction widget shows/hides on state.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/cover-system/video.mp4" type="video/mp4" />
</video>
