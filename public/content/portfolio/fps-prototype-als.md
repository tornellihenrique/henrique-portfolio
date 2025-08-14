---
title: FPS Prototype — ALS-Based First-Person Feel
role: Gameplay Programmer
tech: ["Unreal Engine 5.2", "C++", "ALS v4", "Replication", "ProjectileMovementComponent", "Internal"]
year: 2023
cover: content/portfolio/fps-prototype-als/cover.jpg
---

# Overview
Internal prototype focused on **first-person feel** using **Advanced Locomotion System (ALS)** for movement plus custom first-person animations/state. The weapon system is intentionally simple (ammo/inventory) but fully **replicated**. Bullets are spawned actors using **Projectile Movement Component**; non-gun equipment (e.g., **C4**) fits a generic **Item** abstraction you can hold and use.

## Highlights
- **First-person presentation** on top of ALS with custom aim states (aim / half-aim), animation offsets, and wall-avoidance handling.
- **Replicated projectile weapons**, including **grenades/throwables** and later **projectile piercing**.
- **Generic Item system** (weapons & equipment share core hold/use/equip/drop behaviors).
- **Attachments** (e.g., sniper + sight attachments) and **manual reload** with clip-out behavior.
- **Damage/health & death flow**, simple **HUD/score** hooks, and iterative replication fixes.
- Upgraded the project to **UE 5.2** during development.

## Responsibilities
- Integrated **ALS v4** with first-person camera/arms and aim states; tuned animation offsets and transitions.
- Implemented **Weapon**, **Equipment**, and **EquipmentThrowable** bases; **weapon swap**, **drop**, and **number-key selection**.
- Built **Projectile** actor using **ProjectileMovementComponent** with impact effects and later **piercing**.
- Added **sniper weapon** and **sight attachments**; introduced **grenade throw** and **C4** item.
- Implemented **health/damage**, client **death** handling, and **customizable wall avoidance** for first-person.
- Shipped a minimal **UMG HUD** for ammo/status and quick testing.

## Systems
- **Items/Weapons**
  - Generic item interface for guns and equipment (equip/unequip, drop, swap).
  - Manual reload with “clip-out” support; per-weapon animation offsets and IK alignment.
- **Projectiles/Throwables**
  - Projectile actors (spawn + movement + impact effects).
  - Throwables with server-auth spawn and client prediction cues.
- **Replication**
  - Server-authoritative damage; iterative fixes for edge cases (late joins, death).
  - Projectile state kept minimal; events drive client FX.
- **UI**
  - Lightweight HUD (ammo/weapon) and basic in-world feedback for impacts.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/fps-prototype-als/video.mp4" type="video/mp4" />
</video>