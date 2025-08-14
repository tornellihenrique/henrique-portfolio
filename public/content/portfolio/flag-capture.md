---
title: Flag Capture — Multiplayer CTF Technical Test (UE5)
role: Candidate / Gameplay Programmer
tech: ["Unreal Engine 5", "C++", "Multiplayer", "GAS"]
year: 2025
links:
  github: https://github.com/tornellihenrique/FlagCapture
cover: content/portfolio/flag-capture/cover.jpg
---

# Overview
Interview test: implement a **multiplayer Capture-the-Flag** game starting from the **UE5 First Person** template. Requirements included **listen/dedicated** server support, **auto team assignment**, flag grab/capture/reset rules, **first to 3 points → game reset**, and keeping **Blueprints** for **data/UI only** (gameplay logic in C++). 

## Responsibilities
- Built a **phase-driven match loop** with replicated timers/scores: `Listen → Waiting → Preparing → InProgress → Ended → NextGame`. Controllers and UI react per phase. 
- Implemented **team system** with auto-join and balancing (±1 players), push-model roster replication in GameState. 
- Authored **team-aware spawns** via `AFCSpawnArea` with **safe spawn transform** selection. 
- Created **PlayerController state machine**: Register → Spawn → Playing → Death → Spectating; scoreboard toggles, input mode switching, fades. 
- Wired **flag events** (grab/capture) to UI + stats; GameState tracks team capture totals, win/reset flow. 
- Integrated a **GAS base layer** (ASC on PlayerState, attribute init/effects, ability grants) and **Enhanced Input** binding on the character. 
- Added a **spectator camera** (auto-reframe, dynamic FOV, target persistence) for polished transitions. 

## Gameplay Flow
1. **Register** → UI builds; GameMode sets phase and timers.  
2. **Team select / auto-assign** → balanced rosters replicated in GameState.  
3. **Spawn** → team-valid `AFCSpawnArea` picked; safe transform applied.  
4. **Playing** → equips first weapon, becomes damageable after grace; HUD updates.  
5. **Flag** → grab at mid, carry to **own base** to score; drop on death; reset on score.  
6. **End/Reset** → first to **3 points** triggers reset/next game. 

## Architecture Highlights
- **GameMode/GameState** own phases, replicated **TimeRemaining**, team captures, winners.  
- **PlayerController** drives UX state machine and HUD/scoreboard signals.  
- **Team & Spawn** systems ensure fair joins and safe spawns.  
- **UI** hooks in BP for data/visuals as allowed by the brief. 

## Notes
Completed under interview constraints and aimed to “show off” core multiplayer architecture while adhering to the brief: networking modes, team balance, and BP-limited gameplay. 

## Media
<video controls preload="metadata">
  <source src="content/portfolio/flag-capture/video.mp4" type="video/mp4" />
</video>