---
title: Gameplay Programmer (UE5/C++)
year: 2025
tech: ["Unreal Engine 5", "C++", "Replication", "Enhanced Input", "UMG/Slate", "AnimGraph / IK", "Motion Warping", "AI (BT/EQS)"]
links:
    page: https://store.steampowered.com/app/2883390/WarRock2/
---

# My Work

Gameplay programmer focused on combat feel, character locomotion/animation, and player-facing systems. I design and implement first-person and third-person mechanics, own iteration tooling for tuning/validation, harden features for multiplayer, and integrate UI/UX surfaces to support live content. I also coordinate with animation and design to land reliable networked behavior across weapons, items, vehicles, and missions.&#x20;

# The Game

- Marien Map Showcase
<iframe src="https://www.youtube.com/embed/-hzRQbuX138?si=FDkShyC38tki4LvZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

- Maverick Gameplay Introduction (Extraction Mode)
<iframe src="https://www.youtube.com/embed/EjQIjE7haF4?si=kQiy9Q9DvsQSyDgN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

___

# Impact & Highlights

## Combat & Weapons Systems

* Built recoil modeling pipelines (pattern presets, recovery logic, per-weapon scaling) with runtime toggles and editor tooling; refined aim-offset shaping to prevent clipping and maintain ADS precision.  &#x20;
* Resolved edge cases across fire gating and action transitions (sprint/ADS/bolt-action timings) to guarantee responsive firing under replication. &#x20;

## Animation, Locomotion & Camera

* Reworked aim-offset stacks (spine weighting, procedural offsets), stabilized prone/crouch behaviors, and improved lean evaluation (toggle mode, dynamic length, tilt/sway). &#x20;
* Added first-person stabilizers and synced third-person posing for remote views; removed artifacts like ADS “slide.”&#x20;
* Motion-warped vaults, landing/fall tuning, and vehicle-aware traversal traces.&#x20;

## Items & Class Equipment

* Implemented class equipment set (revive, repair, self-heal, scanning) including custom notifiers, input blocking rules, cooldown/overheat, restock, and full replication flow. &#x20;
* Hardened throwables/placed-item interaction flow (fire-release checks, equip gating when out of charges, visibility/unparenting during use).&#x20;

## UI/UX & Missions

* Shipped dynamic weapon HUD (type auto-detect, ammo states) and global listeners that safely stop firing or hide crosshairs when menus/scoreboard open. &#x20;
* Built lobby quests/challenges pages with rewards integration and an expandable in-home missions panel; added dev-only generators for testing.  &#x20;

## Vehicles & World Interaction

* Tuned repair/vehicle interaction rules (targeting, collision exceptions, friendly checks) and provided custom crosshair support where needed.  &#x20;

## Multiplayer, Replication & Stability

* Fixed spectator flows, spawn-location replication timing, and ensured safe delegate binding patterns; reduced ensures and corrected AI/nav significance issues (including world-origin shift interactions). &#x20;
* Added match-end behaviors for AI and generalized timer/sound cleanup paths in gameplay/UI. &#x20;
