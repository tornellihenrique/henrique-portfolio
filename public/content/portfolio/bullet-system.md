---
title: Bullet System — Advanced Ballistics & Replicated Weapons
role: Solo Developer / Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Replication", "Physics/Ballistics", "Object Pooling", "UMG"]
links:
    github: https://github.com/tornellihenrique/BulletSystem
cover: content/portfolio/bullet-system/cover.jpg
---

# Overview
A focused **teaching prototype** demonstrating an advanced **ballistic projectile** model, a **replicated weapon** actor, and a **first-person sway** component. Built to explain implementation details live to other developers.

## Modules
- **ABSProjectile** — sub-stepped ballistics with aerodynamic drag, wind, density switching, penetration/ricochet, tracer LOD, hit solving, damage, and pooling handoff.
- **ABSWeapon** — replicated weapon actor (equip/unequip, RPM firing loop, pickup/drop physics, state replication, FP/TP montage routing).
- **UBSWeaponSwayComponent** — local-only FP sway (movement/aim) using spring solvers with clamps and tunable stiffness/damping.
- **UBSWeaponSubsystem / UBSWeaponSettings** — content registry + config (auto-discovers projectile BPs, resolves classes by name).
- **ABSWorldSettings** — object pooling (map/array pools) for allocation-free projectile reuse.

## Ballistics (ABSProjectile)
- Deterministic **sub-stepping** inside `Tick`.
- **Aerodynamics:** drag from relative fluid velocity (projectile vs wind), shape-scaled Cd, medium density switching.
- **Environment coupling:** auto-discovers `AWindDirectionalSource`.
- **Hit solving:** complex trace + **material probe** for accurate `UPhysicalMaterial`.
- **Penetration/Ricochet:** angle/velocity driven with energy-based exit speed, bounce clamp.
- **Damage model:** `FPointDamageEvent` with normalized velocity; optional Physics/GeometryCollection impulses.
- **Lifecycle:** returns to pool on lifespan expire; restores CDO-defaults on reset; debug CVars for visuals and feature toggles.

## Weapon Actor (ABSWeapon)
- **Replication:** server-auth state; owner-skip notifies for `bFiring`; RPC to sync intent.
- **Firing loop:** RPM → timer → `OnFired`; client FX in `OnFiring`.
- **Pickup/Drop:** authoritative ownership; physics profile swap, mass/impulse on drop.
- **Sockets/Offsets:** muzzle from `Muzzle`; alignment via pivot offset.
- **Animation:** local-only FP montage routing; TP compatible.

## First-Person Sway (UBSWeaponSwayComponent)
- Local-only execution.
- **Movement sway:** world→local velocity, spring-interp loc/rot with separate speeds.
- **Aim sway:** look-delta accumulation, per-axis springs, clamped outputs and ratios.

## Content & Pooling
- **Registry & settings:** scans configured folders, filters dev/skeletal BPs, exposes sorted names + class lookup.
- **Pooling:** `ABSWorldSettings` map/array pools with push/pop API; projectiles recycle on expire.

## Media
<video controls preload="metadata">
  <source src="content/portfolio/bullet-system/video.mp4" type="video/mp4" />
</video>