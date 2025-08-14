---
title: Reima — First/Third-Person Combat Prototype
role: Solo Developer / Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "ALS (retargeted to Manny)", "Metahuman", "UMG", "Vehicles"]
year: 2024
cover: content/portfolio/project-reima/cover.jpg
---

# Overview
Prototype exploring **first- and third-person combat** with a **spatial equipment inventory**, holster/attachment flow, and a layered animation approach for character personality. I **retargeted ALS** to the UE5 **Manny** skeleton so it plays nicely with **Metahumans**. Combat included **explosive projectiles**, **advanced bullet physics**, a **damage system** and **death** (tested against dummies). I also rewrote a **vehicle** from the Matrix demo approach so the character can **enter/drive/exit** with transition animations.

## Highlights
- **FP/TP switch** focused on feel; guns holster to the **back** when not in hands.
- **Spatial inventory** with **slots** for clothes & weapons; equip/unequip flow.
- **Limp overlay** on top of ALS for an old-man gait while walking/sprinting.
- **Explosive projectiles** and **bullet physics**; **damage & death** loop.
- **Vehicle** you can enter/drive/exit; rewritten from the Matrix sample pattern.

## Responsibilities
- Retargeted **ALS** to **Manny**; integrated with **Metahuman** body/face.
- Implemented **first/third-person presentation** and holster/attach points (back).
- Built a **spatial inventory with equippable slots** (clothes, weapons).
- Authored **explosive projectiles** and tuned **bullet physics** behavior.
- Implemented **damage processing** and **death**; created dummy targets.
- Rewrote a **car** system based on the Matrix demo code-path; added **enter/exit** transitions.

## Systems

### Camera / View
- Runtime **FP↔TP** switching; arms/camera offsets tuned for readability.

### Inventory / Equipment
- **Slot-based** equipment (clothes, weapons); equip/unequip state and holster rules.
- Weapons attach to **back sockets** when not held.

### Weapons & Projectiles
- **Explosive projectiles** with detonation when hitting surfaces/targets.
- **Bullet physics** (ballistics behavior tuned for feel).

### Character / Animation
- **ALS** base locomotion with **overlay** that adds a **limp** while walking/sprinting.
- Retarget to **Manny** for **Metahuman** compatibility.

### Vehicle
- **Enter → drive → exit** sequence with transition animations.
- Vehicle logic **rewritten** following the **Matrix demo** approach to fit this project.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/project-reima/video.mp4" type="video/mp4" />
</video>