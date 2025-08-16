---
title: Bunny Hopping — FPS Sandbox/Prototype
role: Gameplay Programmer
tech: ["Unreal Engine 5","C++","ALS","Enhanced Input","Replication","Motion Warping"]
year: 2025
cover: content/portfolio/bunny-hopping/cover.jpg
---

## Overview
Personal prototype focused on **GoldSrc-style bunny hopping** and a clean, replicated FPS/TP stack. The project demonstrates my gameplay architecture standards for movement, interaction, weapons, inventory, HUD/overlays, and match flow. It also includes a team-vs-team “Battle” mode and a “Sandbox” testing mode.

## Core Highlights
- **Dual-mesh FP/TP pipeline** with a dedicated FP skeletal mesh and per-hand camera setup; recoil component and owner-only ammo replication for correctness and bandwidth.  
- **Movement & input** via Enhanced Input; custom movement tuned for bunny hopping feel.  
- **Weapons & hotbar** (pickup/drop, restock, attachments) with client-authoritative feedback + server reconciliation.  
- **Damage model** with per-bone factors and basic armor domain handling (helmet/vest).  
- **Interaction system**: priority-scored, distance/FOV-gated interactables with outline highlights.  
- **UI/Overlays**: player overlay, scoreboard, match transitions; minimap/markers classes present.  
- **Battle mode**: phase timers, roster tracking, spawn selection, spectating, scoreboard; server-defined multipliers for match/tickets/damage.

## Systems & Architecture

### First/Third Person Stack
- FP mesh attached to the TP mesh; dedicated **camera** component bound to FP mesh; **recoil animation** component for local view kick.  
- Owner-only **AmmoInventory** replication; skip-owner flags where appropriate to reduce traffic.

### Movement (Bunny Hopping)
- Custom Character Movement (component) tuned for GoldSrc-style **air-accel / bhop** feel (prototype; gameplay rules intentionally minimal).  
- ADS rules integrate with gait limits to avoid sprint-while-ADS inconsistencies.

### Weapons, Inventory & Attachments
- Hotbar-managed weapon set; restock pipeline; attachment update hooks for UI.  
- Melee trace path switches range based on FP/TP view for correct hitboxes.  
- Client FX routing (crosshair, HUD) with server-auth firing state and damage.

### Interaction
- Interface-driven interaction with **distance/angle scoring**, highlight distance separate from interact distance; outlines mirrored to current and previous weapons for consistency.

### Damage & Armor
- Per-bone damage multiplier resolution (nearest-ancestor match); simple armor domain that can flip headshot flags and absorb damage.

### Game Modes & HUD
- **Battle**: GameState/Mode manage **phase timers**, team rosters, spawnable areas; PlayerController holds **PlayerStart** (owner-only replication), handles match enter/exit, spectating, scoreboard display.  
- **Sandbox**: Dev toggles (god mode, no-reload, infinite ammo) and overlay inspection.  
- **Minimap & markers**: overlay and world label/marker classes are present for UI integration.

## Media
- **Sandbox**
<video controls preload="metadata">
  <source src="content/portfolio/bunny-hopping/sandbox.mp4" type="video/mp4" />
</video>

- **Battle**
<video controls preload="metadata">
  <source src="content/portfolio/bunny-hopping/battle.mp4" type="video/mp4" />
</video>