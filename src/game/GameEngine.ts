import {
  DifficultyMode,
  FloatingText,
  GameSettings,
  GameStats,
  Obstacle,
  ObstacleType,
  OrbItem,
  Particle,
  PlayerState,
  PowerUpType,
} from '../types';
import { audioService } from '../services/audioService';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Game Dimensions
  public width: number = 800;
  public height: number = 450;
  public groundY: number = 380;

  // State
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public difficulty: DifficultyMode = 'thriller';
  public settings: GameSettings;

  // Premium VIP Customizations
  public equippedSkin: string = 'default';
  public equippedTrail: string = 'cyan';
  public equippedTheme: 'cyber_night' | 'royal_gold' | 'thriller_blood' | 'neon_galaxy' | 'matrix_void' = 'cyber_night';
  public isVipPassActive: boolean = false;

  // Game Loop
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Player
  public player: PlayerState = {
    x: 100,
    y: 300,
    width: 44,
    height: 70,
    velocityY: 0,
    isGrounded: true,
    isJumping: false,
    isSliding: false,
    jumpCount: 0,
    maxJumps: 2,
    slideTimer: 0,
    moonwalkTimer: 0,
    animFrame: 0,
    animTimer: 0,
  };

  // Physics Constants
  private gravity: number = 0.65;
  private jumpForce: number = -13.5;
  private baseSpeed: number = 7;
  public currentSpeed: number = 7;

  // Entities
  private obstacles: Obstacle[] = [];
  private orbs: OrbItem[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  // Spawners
  private obstacleTimer: number = 0;
  private obstacleInterval: number = 100;
  private orbTimer: number = 0;

  // Milestones & High Score
  private passedMilestones: Set<number> = new Set();
  public previousHighScore: number = 0;

  // Stats
  public stats: GameStats = {
    score: 0,
    distance: 0,
    level: 1,
    orbsCollected: 0,
    combo: 0,
    maxCombo: 0,
    speed: 7,
    speedMultiplier: 1,
    lives: 1,
    activePowerUp: null,
    hasShield: false,
    distanceScore: 0,
    orbScore: 0,
    bonusScore: 0,
    currentMultiplier: 1,
    highScoreBeaten: false,
  };

  // Parallax background offsets
  private bgLayer1X: number = 0;
  private bgLayer2X: number = 0;
  private bgLayer3X: number = 0;

  // Screen Shake
  private shakeTimer: number = 0;
  private shakeIntensity: number = 0;

  // Callbacks
  private onGameOverCb?: (stats: GameStats) => void;
  private onStatsUpdateCb?: (stats: GameStats) => void;

  constructor(canvas: HTMLCanvasElement, settings: GameSettings, difficulty: DifficultyMode) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2d context');
    this.ctx = context;

    this.settings = settings;
    this.difficulty = difficulty;
    this.applyDifficultySettings();
    this.resizeCanvas();
  }

  public setCallbacks(onGameOver: (stats: GameStats) => void, onStatsUpdate: (stats: GameStats) => void) {
    this.onGameOverCb = onGameOver;
    this.onStatsUpdateCb = onStatsUpdate;
  }

  public resizeCanvas() {
    if (!this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 800;
    this.canvas.height = rect.height || 450;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.groundY = this.height - 70;

    // Adjust player initial y ground
    if (this.player.isGrounded) {
      this.player.y = this.groundY - this.player.height;
    }
  }

  private applyDifficultySettings() {
    switch (this.difficulty) {
      case 'smooth':
        this.baseSpeed = 6;
        this.obstacleInterval = 120;
        break;
      case 'thriller':
        this.baseSpeed = 7.5;
        this.obstacleInterval = 90;
        break;
      case 'dangerous':
        this.baseSpeed = 9;
        this.obstacleInterval = 70;
        break;
    }
    this.currentSpeed = this.baseSpeed;
    this.stats.speed = this.currentSpeed;
  }

  public start() {
    this.reset();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    if (this.isVipPassActive) {
      this.addFloatingText('👑 VIP AUTO-SHIELD ACTIVATED!', this.player.x, this.player.y - 45, '#ffd700', 20);
    }
    this.gameLoop(this.lastTime);
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastTime = performance.now();
      this.gameLoop(this.lastTime);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public setPreviousHighScore(hs: number) {
    this.previousHighScore = hs;
  }

  public reset() {
    this.applyDifficultySettings();
    this.passedMilestones.clear();
    this.player = {
      x: Math.max(60, this.width * 0.12),
      y: this.groundY - 70,
      width: 44,
      height: 70,
      velocityY: 0,
      isGrounded: true,
      isJumping: false,
      isSliding: false,
      jumpCount: 0,
      maxJumps: 2,
      slideTimer: 0,
      moonwalkTimer: 0,
      animFrame: 0,
      animTimer: 0,
    };

    this.obstacles = [];
    this.orbs = [];
    this.particles = [];
    this.floatingTexts = [];
    this.obstacleTimer = 0;
    this.orbTimer = 0;

    this.stats = {
      score: 0,
      distance: 0,
      level: 1,
      orbsCollected: 0,
      combo: 0,
      maxCombo: 0,
      speed: this.baseSpeed,
      speedMultiplier: 1,
      lives: 1,
      activePowerUp: null,
      hasShield: this.isVipPassActive,
      distanceScore: 0,
      orbScore: 0,
      bonusScore: 0,
      currentMultiplier: 1,
      highScoreBeaten: false,
    };
  }

  // CONTROLS
  public triggerJump() {
    if (!this.isRunning || this.isPaused) return;

    if (this.player.isGrounded || this.player.jumpCount < this.player.maxJumps) {
      // If sliding, cancel slide first
      if (this.player.isSliding) {
        this.player.isSliding = false;
        this.player.height = 70;
        this.player.y -= 30;
      }

      // Check gravity powerup
      const gravityMult = this.stats.activePowerUp?.type === 'gravity' ? 0.75 : 1;
      this.player.velocityY = this.jumpForce * gravityMult;
      this.player.isGrounded = false;
      this.player.isJumping = true;
      this.player.jumpCount++;

      // Trigger Moonwalk aesthetic glide effect on double jump!
      if (this.player.jumpCount > 1) {
        this.player.moonwalkTimer = 25;
        audioService.playDoubleJump();
        this.addParticles(this.player.x + 20, this.player.y + 60, '#00f3ff', 12);
        this.addFloatingText('MOONWALK!', this.player.x, this.player.y - 20, '#00f3ff', 20);
      } else {
        audioService.playJump();
        this.addParticles(this.player.x + 20, this.player.y + 60, '#ff00ff', 8);
      }
    }
  }

  public triggerSlide() {
    if (!this.isRunning || this.isPaused) return;

    if (this.player.isGrounded && !this.player.isSliding) {
      this.player.isSliding = true;
      this.player.slideTimer = 35; // Frames of sliding
      this.player.height = 36;
      this.player.y += 34; // Lower center of gravity
      audioService.playSlide();
      this.addParticles(this.player.x, this.player.y + 30, '#ff00ff', 10);
    } else if (!this.player.isGrounded) {
      // Fast fall maneuver
      this.player.velocityY = 15;
    }
  }

  public triggerAbility() {
    if (!this.isRunning || this.isPaused) return;

    if (this.stats.activePowerUp) {
      // Perform ability blast
      if (this.stats.activePowerUp.type === 'blast') {
        this.activateBlastAbility();
      }
    }
  }

  private activateBlastAbility() {
    audioService.playPowerUp();
    this.addScreenShake(12);

    // Destroy all visible obstacles on screen
    this.obstacles.forEach((obs) => {
      this.addParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#00ff88', 20);
      this.addFloatingText('+250 BLAST!', obs.x, obs.y, '#00ff88', 22);
      this.stats.score += 250;
      this.stats.bonusScore = (this.stats.bonusScore || 0) + 250;
    });
    this.obstacles = [];
    this.stats.activePowerUp = null; // consume
  }

  private addScreenShake(intensity: number) {
    if (!this.settings.screenShake) return;
    this.shakeIntensity = intensity;
    this.shakeTimer = 15;
  }

  // GAME LOOP
  private gameLoop = (timestamp: number) => {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (!this.isPaused) {
      this.update(dt);
      this.render();
    }

    this.animFrameId = requestAnimationFrame(this.gameLoop);
  };

  // UPDATE LOGIC
  private update(dt: number) {
    // 1. Level Calculation & Speed Scaling Across 100 Levels
    this.stats.distance += (this.currentSpeed * dt * 60) / 40; // Convert to meters

    // Level formula: 1 Level per 100 meters, capped at Level 100
    const calculatedLevel = Math.min(100, Math.floor(this.stats.distance / 100) + 1);

    // Trigger Level Up Celebration!
    if (calculatedLevel > this.stats.level) {
      this.stats.level = calculatedLevel;
      audioService.playPowerUp();
      this.addScreenShake(10);
      this.addParticles(this.player.x + 20, this.player.y + 20, '#00ff88', 30);
      this.addFloatingText(
        `LEVEL ${calculatedLevel} / 100!`,
        this.player.x - 20,
        this.player.y - 40,
        '#00ff88',
        24
      );
    }

    // Speed increases progressively with each level up to level 100
    const levelSpeedBonus = (this.stats.level - 1) * 0.12;
    this.currentSpeed = this.baseSpeed + levelSpeedBonus;
    this.stats.speed = Math.round(this.currentSpeed * 10) / 10;

    // Continuous score based on distance, level, and active score multiplier
    const powerUpMult = this.stats.activePowerUp?.type === 'multiplier' ? 3 : 1;
    const comboMult = 1 + this.stats.combo * 0.1;
    const levelMult = 1 + (this.stats.level - 1) * 0.05;
    const totalMultiplier = Math.round(powerUpMult * comboMult * levelMult * 10) / 10;
    this.stats.currentMultiplier = totalMultiplier;

    const distScoreGained = Math.round(this.currentSpeed * dt * 10 * totalMultiplier);
    this.stats.score += distScoreGained;
    this.stats.distanceScore = (this.stats.distanceScore || 0) + distScoreGained;

    // Check High Score Beat Celebration
    if (this.previousHighScore > 0 && this.stats.score > this.previousHighScore && !this.stats.highScoreBeaten) {
      this.stats.highScoreBeaten = true;
      audioService.playPowerUp();
      this.addScreenShake(12);
      this.addFloatingText('🔥 NEW HIGH SCORE RECORD!', this.player.x - 40, this.player.y - 50, '#ffcc00', 24);
    }

    // Check Score Milestones
    const scoreMilestones = [1000, 5000, 10000, 25000, 50000, 100000];
    for (const m of scoreMilestones) {
      if (this.stats.score >= m && !this.passedMilestones.has(m)) {
        this.passedMilestones.add(m);
        audioService.playPowerUp();
        this.addFloatingText(`🎉 ${m.toLocaleString()} PTS MILESTONE!`, this.player.x - 30, this.player.y - 40, '#00ff88', 22);
      }
    }

    // Update active power-up timer
    if (this.stats.activePowerUp) {
      this.stats.activePowerUp.remainingTime -= dt * 1000;
      if (this.stats.activePowerUp.remainingTime <= 0) {
        this.stats.activePowerUp = null;
      }
    }

    // 2. Player Physics
    if (this.player.moonwalkTimer > 0) this.player.moonwalkTimer--;

    // Gravity calculation
    const gravityMult = this.stats.activePowerUp?.type === 'gravity' ? 0.6 : 1;
    this.player.velocityY += this.gravity * gravityMult;
    this.player.y += this.player.velocityY;

    // Ground check
    const currentGroundY = this.groundY - this.player.height;
    if (this.player.y >= currentGroundY) {
      this.player.y = currentGroundY;
      this.player.velocityY = 0;
      this.player.isGrounded = true;
      this.player.isJumping = false;
      this.player.jumpCount = 0;
    }

    // Slide Timer
    if (this.player.isSliding) {
      this.player.slideTimer--;
      if (this.player.slideTimer <= 0) {
        this.player.isSliding = false;
        this.player.height = 70;
        this.player.y -= 34; // Restore height
      }
    }

    // Animation frames
    this.player.animTimer++;
    if (this.player.animTimer > 5) {
      this.player.animTimer = 0;
      this.player.animFrame = (this.player.animFrame + 1) % 6;
    }

    // Custom Footstep Trail Particles
    if (this.player.isGrounded && Math.random() < 0.4) {
      let trailColor = '#00f3ff';
      if (this.equippedTrail === 'gold_sparkles') trailColor = '#ffd700';
      else if (this.equippedTrail === 'rainbow_laser') {
        const rainbow = ['#00f3ff', '#ff00ff', '#ffd700', '#00ff66', '#ff0055'];
        trailColor = rainbow[Math.floor(Math.random() * rainbow.length)];
      } else if (this.equippedTrail === 'matrix_code') trailColor = '#00ff66';

      this.addParticles(
        this.player.x + Math.random() * 20,
        this.groundY - 2,
        trailColor,
        1
      );
    }

    // 3. Spawners (Obstacle interval decreases as Level increases from 1 to 100)
    this.obstacleTimer++;
    const intervalReduction = Math.min(65, (this.stats.level - 1) * 0.65);
    const currentInterval = Math.max(28, this.obstacleInterval - intervalReduction);
    if (this.obstacleTimer > currentInterval) {
      this.spawnObstacle();
      this.obstacleTimer = 0;
    }

    this.orbTimer++;
    if (this.orbTimer > 70) {
      this.spawnOrbsAndGems();
      this.orbTimer = 0;
    }

    // 4. Update Entities
    this.updateObstacles(dt);
    this.updateOrbs(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    // Parallax background updates
    this.bgLayer1X = (this.bgLayer1X + this.currentSpeed * 0.1) % this.width;
    this.bgLayer2X = (this.bgLayer2X + this.currentSpeed * 0.3) % this.width;
    this.bgLayer3X = (this.bgLayer3X + this.currentSpeed * 0.7) % this.width;

    // Screen shake update
    if (this.shakeTimer > 0) {
      this.shakeTimer--;
    }

    // Notify stats listener
    if (this.onStatsUpdateCb) {
      this.onStatsUpdateCb({ ...this.stats });
    }
  }

  // SPAWNERS WITH LEVEL 1-100 DIFFICULTY TIER DISTRIBUTION
  private spawnObstacle() {
    const lvl = this.stats.level;
    const rand = Math.random();
    let type: ObstacleType = 'spike';

    if (lvl <= 5) {
      // Levels 1-5: Mostly spikes and simple lasers
      type = rand < 0.7 ? 'spike' : 'laser';
    } else if (lvl <= 20) {
      // Levels 6-20: Spikes, lasers, drones
      if (rand < 0.45) type = 'spike';
      else if (rand < 0.75) type = 'laser';
      else type = 'drone';
    } else if (lvl <= 50) {
      // Levels 21-50: Full hazard suite with drones & glitch walls
      if (rand < 0.35) type = 'spike';
      else if (rand < 0.6) type = 'laser';
      else if (rand < 0.8) type = 'drone';
      else type = 'wall';
    } else {
      // Levels 51-100: Extreme hazard mixing
      if (rand < 0.25) type = 'spike';
      else if (rand < 0.5) type = 'laser';
      else if (rand < 0.75) type = 'drone';
      else type = 'wall';
    }

    let y = this.groundY - 45;
    let width = 40;
    let height = 45;
    let color = '#ff0055';

    if (type === 'drone') {
      y = this.groundY - 110 - Math.random() * 60; // Flying obstacle
      width = 42;
      height = 36;
      color = lvl > 50 ? '#ff00ff' : '#a800ff';
    } else if (type === 'laser') {
      y = this.groundY - 120; // Must slide under
      width = 24;
      height = 80;
      color = lvl > 75 ? '#ff3300' : '#00f3ff';
    } else if (type === 'wall') {
      y = this.groundY - 90;
      width = 38;
      height = 90;
      color = lvl > 90 ? '#ff0000' : '#ff9900';
    }

    this.obstacles.push({
      id: Date.now().toString() + Math.random(),
      type,
      x: this.width + 50,
      y,
      width,
      height,
      speed: this.currentSpeed,
      passed: false,
      color,
      pulseOffset: Math.random() * Math.PI * 2,
    });
  }

  private spawnOrbsAndGems() {
    const isPowerUp = Math.random() < 0.35;
    const spawnY = this.groundY - 60 - Math.random() * 110;

    if (isPowerUp) {
      const types: PowerUpType[] = ['shield', 'multiplier', 'magnet', 'gravity', 'blast'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      let color = '#00ffff';
      if (chosenType === 'multiplier') color = '#ffcc00';
      if (chosenType === 'magnet') color = '#ff0066';
      if (chosenType === 'gravity') color = '#9900ff';
      if (chosenType === 'blast') color = '#00ff66';

      this.orbs.push({
        id: Date.now().toString() + Math.random(),
        type: chosenType,
        x: this.width + 40,
        y: spawnY,
        radius: 16,
        baseY: spawnY,
        floatOffset: Math.random() * 10,
        collected: false,
        color,
        value: 300,
      });
    } else {
      // Spawn arc of score gems
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const gemX = this.width + 40 + i * 36;
        const gemY = spawnY - Math.sin((i / count) * Math.PI) * 40;
        this.orbs.push({
          id: Date.now().toString() + i,
          type: 'gem',
          x: gemX,
          y: gemY,
          radius: 10,
          baseY: gemY,
          floatOffset: i * 0.5,
          collected: false,
          color: '#00f3ff',
          value: 100,
        });
      }
    }
  }

  // ENTITY UPDATES
  private updateObstacles(dt: number) {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.currentSpeed * dt * 60;

      // Check if player passed obstacle for combo bonus
      if (!obs.passed && obs.x + obs.width < this.player.x) {
        obs.passed = true;
        this.stats.combo++;
        if (this.stats.combo > this.stats.maxCombo) {
          this.stats.maxCombo = this.stats.combo;
        }

        // Close call callout sound
        if (Math.abs(obs.x + obs.width - this.player.x) < 40) {
          audioService.playDodge();
          this.addFloatingText('CLOSE CALL! +150', this.player.x, this.player.y - 30, '#ffcc00', 18);
          this.stats.score += 150;
          this.stats.bonusScore = (this.stats.bonusScore || 0) + 150;
        }
      }

      // Collision Check with Player
      if (this.checkCollision(this.player, obs)) {
        this.handleObstacleCollision(obs, i);
      }

      // Remove offscreen
      if (obs.x < -100) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  private updateOrbs(dt: number) {
    const hasMagnet = this.stats.activePowerUp?.type === 'magnet' || this.isVipPassActive;
    const pullRadius = this.stats.activePowerUp?.type === 'magnet' ? 340 : (this.isVipPassActive ? 180 : 0);

    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];

      // Magnet Pull Math (PowerUp or Passive VIP Magnet Aura)
      if (hasMagnet && !orb.collected) {
        const dx = this.player.x + this.player.width / 2 - orb.x;
        const dy = this.player.y + this.player.height / 2 - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pullRadius) {
          const speed = this.stats.activePowerUp?.type === 'magnet' ? 14 : 9;
          orb.x += (dx / dist) * speed;
          orb.y += (dy / dist) * speed;
        }
      }

      orb.x -= this.currentSpeed * dt * 60;
      orb.floatOffset += 0.08;
      orb.y = orb.baseY + Math.sin(orb.floatOffset) * 6;

      // Check Collection
      const dx = this.player.x + this.player.width / 2 - orb.x;
      const dy = this.player.y + this.player.height / 2 - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < orb.radius + this.player.width / 2) {
        this.collectOrb(orb, i);
      } else if (orb.x < -50) {
        this.orbs.splice(i, 1);
      }
    }
  }

  private collectOrb(orb: OrbItem, index: number) {
    audioService.playOrbCollect(this.stats.combo);
    this.addParticles(orb.x, orb.y, orb.color, 14);

    const vipMult = this.isVipPassActive ? 2 : 1;

    if (orb.type === 'gem') {
      const points = orb.value * (this.stats.activePowerUp?.type === 'multiplier' ? 3 : 1) * vipMult;
      this.stats.score += points;
      this.stats.orbScore = (this.stats.orbScore || 0) + points;
      this.stats.orbsCollected += vipMult;
      const text = this.isVipPassActive ? `+${points} (2X VIP)` : `+${points}`;
      const textColor = this.isVipPassActive ? '#ffd700' : '#00f3ff';
      this.addFloatingText(text, orb.x, orb.y, textColor, 16);
    } else {
      // PowerUp collected!
      const points = 300 * (this.stats.activePowerUp?.type === 'multiplier' ? 3 : 1) * vipMult;
      this.stats.score += points;
      this.stats.orbScore = (this.stats.orbScore || 0) + points;
      this.stats.orbsCollected += vipMult;
      audioService.playPowerUp();

      if (orb.type === 'shield') {
        this.stats.hasShield = true;
        this.addFloatingText('NEON SHIELD ACTIVE!', this.player.x - 20, this.player.y - 40, '#00ffff', 22);
      } else {
        this.stats.activePowerUp = {
          type: orb.type as PowerUpType,
          duration: 8000,
          remainingTime: 8000,
        };
        const labels: Record<PowerUpType, string> = {
          shield: 'SHIELD',
          multiplier: '3X MULTIPLIER!',
          magnet: 'MAGNET SURGE!',
          gravity: 'MOONWALK FLOAT!',
          blast: 'BLAST READY! (PRESS SHIFT)',
        };
        this.addFloatingText(labels[orb.type as PowerUpType], this.player.x - 20, this.player.y - 40, orb.color, 22);
      }
    }

    this.orbs.splice(index, 1);
  }

  private checkCollision(player: PlayerState, obs: Obstacle): boolean {
    const pBox = {
      x: player.x + 6,
      y: player.y + 4,
      width: player.width - 12,
      height: player.height - 8,
    };

    return (
      pBox.x < obs.x + obs.width &&
      pBox.x + pBox.width > obs.x &&
      pBox.y < obs.y + obs.height &&
      pBox.y + pBox.height > obs.y
    );
  }

  private handleObstacleCollision(obs: Obstacle, index: number) {
    if (this.stats.hasShield) {
      // Shield absorbs hit!
      this.stats.hasShield = false;
      audioService.playHit();
      this.addScreenShake(10);
      this.addParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#00ffff', 20);
      this.addFloatingText('SHIELD BROKEN!', this.player.x, this.player.y - 30, '#00ffff', 20);
      this.obstacles.splice(index, 1);
      return;
    }

    // Hit without shield! Game Over
    audioService.playHit();
    audioService.playGameOver();
    this.addScreenShake(18);
    this.addParticles(this.player.x + 20, this.player.y + 35, '#ff0055', 30);

    this.stop();
    if (this.onGameOverCb) {
      this.onGameOverCb({ ...this.stats });
    }
  }

  // PARTICLES & TEXT
  private addParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 20,
      });
    }
  }

  private addFloatingText(text: string, x: number, y: number, color: string, fontSize: number = 18) {
    this.floatingTexts.push({
      id: Date.now().toString() + Math.random(),
      text,
      x,
      y,
      color,
      alpha: 1,
      fontSize,
      vy: -1.8,
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // RENDER LOGIC
  public render() {
    this.ctx.save();

    // Screen Shake Offset
    if (this.shakeTimer > 0) {
      const dx = (Math.random() - 0.5) * this.shakeIntensity;
      const dy = (Math.random() - 0.5) * this.shakeIntensity;
      this.ctx.translate(dx, dy);
    }

    // Clear Screen
    this.ctx.fillStyle = '#060612'; // Dark Cyber Space
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Draw Parallax Backgrounds
    this.drawCyberBackground();

    // 2. Draw Floor Grid
    this.drawCyberRoad();

    // 3. Draw Orbs & Gems
    this.drawOrbs();

    // 4. Draw Obstacles
    this.drawObstacles();

    // 5. Draw Player Character (MJ Cyber Runner)
    this.drawPlayer();

    // 6. Draw Particles & FX
    this.drawParticles();
    this.drawFloatingTexts();

    this.ctx.restore();
  }

  // DRAW PARALLAX BACKGROUND ACCORDING TO EQUIPPED THEME
  private drawCyberBackground() {
    const ctx = this.ctx;
    const theme = this.equippedTheme;

    let skyStop1 = '#090014';
    let skyStop2 = '#180033';
    let skyStop3 = '#33004d';

    let moonInner = '#ff00ff';
    let moonOuter = '#9900ff';
    let moonGridColor = 'rgba(255, 255, 255, 0.2)';

    let b1Color = '#0d001a';
    let b2Color = '#140026';
    let winColor = 'rgba(255, 0, 255, 0.15)';
    let signColors = ['rgba(0, 243, 255, 0.4)', 'rgba(255, 0, 255, 0.4)'];

    if (theme === 'royal_gold') {
      skyStop1 = '#1a1200';
      skyStop2 = '#332400';
      skyStop3 = '#4d3700';
      moonInner = '#ffd700';
      moonOuter = '#ff8800';
      moonGridColor = 'rgba(255, 215, 0, 0.3)';
      b1Color = '#1f1600';
      b2Color = '#2b1e00';
      winColor = 'rgba(255, 215, 0, 0.25)';
      signColors = ['rgba(255, 215, 0, 0.6)', 'rgba(255, 230, 100, 0.6)'];
    } else if (theme === 'thriller_blood') {
      skyStop1 = '#1f0005';
      skyStop2 = '#3b000a';
      skyStop3 = '#590010';
      moonInner = '#ff0033';
      moonOuter = '#800010';
      moonGridColor = 'rgba(255, 0, 85, 0.3)';
      b1Color = '#1a0004';
      b2Color = '#290008';
      winColor = 'rgba(255, 0, 85, 0.25)';
      signColors = ['rgba(255, 0, 85, 0.6)', 'rgba(255, 51, 0, 0.6)'];
    } else if (theme === 'neon_galaxy') {
      skyStop1 = '#05001f';
      skyStop2 = '#0d003b';
      skyStop3 = '#180059';
      moonInner = '#a800ff';
      moonOuter = '#00f3ff';
      moonGridColor = 'rgba(0, 243, 255, 0.3)';
      b1Color = '#0b002b';
      b2Color = '#120042';
      winColor = 'rgba(0, 243, 255, 0.2)';
      signColors = ['rgba(168, 0, 255, 0.6)', 'rgba(0, 243, 255, 0.6)'];
    } else if (theme === 'matrix_void') {
      skyStop1 = '#001206';
      skyStop2 = '#00240c';
      skyStop3 = '#003813';
      moonInner = '#00ff66';
      moonOuter = '#008033';
      moonGridColor = 'rgba(0, 255, 102, 0.3)';
      b1Color = '#001a08';
      b2Color = '#002b0e';
      winColor = 'rgba(0, 255, 102, 0.25)';
      signColors = ['rgba(0, 255, 102, 0.6)', 'rgba(102, 255, 178, 0.6)'];
    }

    // Gradient Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, skyStop1);
    skyGrad.addColorStop(0.6, skyStop2);
    skyGrad.addColorStop(1, skyStop3);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Special Matrix Code Rain overlay for matrix_void
    if (theme === 'matrix_void') {
      ctx.fillStyle = 'rgba(0, 255, 102, 0.15)';
      ctx.font = '10px monospace';
      const time = Date.now() * 0.002;
      for (let x = 10; x < this.width; x += 30) {
        const fallY = (Math.sin(x + time) * 100 + time * 60) % this.height;
        ctx.fillText('010110', x, fallY);
      }
    }

    // Special Starfield for neon_galaxy
    if (theme === 'neon_galaxy') {
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 25; s++) {
        const sx = (s * 47) % this.width;
        const sy = (s * 23) % (this.height * 0.6);
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.003 + s) * 0.3;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1.0;
    }

    // Cyber Moon
    const moonX = this.width * 0.8;
    const moonY = 80;
    const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 65);
    moonGrad.addColorStop(0, moonInner);
    moonGrad.addColorStop(0.5, moonOuter);
    moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 65, 0, Math.PI * 2);
    ctx.fill();

    // Moon Gridlines
    ctx.strokeStyle = moonGridColor;
    ctx.lineWidth = 1;
    for (let i = -50; i <= 50; i += 12) {
      ctx.beginPath();
      ctx.moveTo(moonX - 50, moonY + i);
      ctx.lineTo(moonX + 50, moonY + i);
      ctx.stroke();
    }

    // Parallax Layer 1: Distant Cyber City Skyline
    ctx.fillStyle = b1Color;
    const buildingWidths = [60, 40, 80, 50, 70, 90, 45, 65];
    let bX = -this.bgLayer1X;
    let idx = 0;

    while (bX < this.width + 100) {
      const bw = buildingWidths[idx % buildingWidths.length];
      const bh = 140 + (idx * 27) % 100;
      ctx.fillRect(bX, this.groundY - bh, bw - 4, bh);

      // Neon Hologram Signs on Skyline buildings
      if (idx % 3 === 0) {
        ctx.fillStyle = idx % 2 === 0 ? signColors[0] : signColors[1];
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(idx % 2 === 0 ? 'NEO-MJ' : '23-CYBER', bX + 6, this.groundY - bh + 25);
        ctx.fillStyle = b1Color;
      }

      bX += bw;
      idx++;
    }

    // Parallax Layer 2: Mid-ground Glowing Towers
    ctx.fillStyle = b2Color;
    let bX2 = -this.bgLayer2X;
    let idx2 = 0;

    while (bX2 < this.width + 100) {
      const bw = 55 + (idx2 * 19) % 50;
      const bh = 90 + (idx2 * 31) % 70;
      ctx.fillRect(bX2, this.groundY - bh, bw - 6, bh);

      // Glowing windows
      ctx.fillStyle = winColor;
      for (let wy = this.groundY - bh + 10; wy < this.groundY - 10; wy += 14) {
        for (let wx = bX2 + 6; wx < bX2 + bw - 12; wx += 10) {
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
      ctx.fillStyle = b2Color;

      bX2 += bw;
      idx2++;
    }
  }

  // DRAW CYBER ROAD / GRID FLOOR ACCORDING TO THEME
  private drawCyberRoad() {
    const ctx = this.ctx;
    const theme = this.equippedTheme;

    let roadStart = '#10002b';
    let roadEnd = '#050012';
    let horizonColor = '#ff00ff';
    let gridLineColor = 'rgba(0, 243, 255, 0.4)';
    let gridGlow = '#00f3ff';

    if (theme === 'royal_gold') {
      roadStart = '#261b00';
      roadEnd = '#0d0900';
      horizonColor = '#ffd700';
      gridLineColor = 'rgba(255, 215, 0, 0.5)';
      gridGlow = '#ffd700';
    } else if (theme === 'thriller_blood') {
      roadStart = '#260007';
      roadEnd = '#0d0002';
      horizonColor = '#ff0033';
      gridLineColor = 'rgba(255, 0, 85, 0.5)';
      gridGlow = '#ff0055';
    } else if (theme === 'neon_galaxy') {
      roadStart = '#0f0038';
      roadEnd = '#050014';
      horizonColor = '#00f3ff';
      gridLineColor = 'rgba(168, 0, 255, 0.5)';
      gridGlow = '#a800ff';
    } else if (theme === 'matrix_void') {
      roadStart = '#00260e';
      roadEnd = '#000d05';
      horizonColor = '#00ff66';
      gridLineColor = 'rgba(0, 255, 102, 0.5)';
      gridGlow = '#00ff66';
    }

    // Road Base
    const roadGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height);
    roadGrad.addColorStop(0, roadStart);
    roadGrad.addColorStop(1, roadEnd);
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

    // Glowing Horizon Line
    ctx.strokeStyle = horizonColor;
    ctx.shadowColor = horizonColor;
    ctx.shadowBlur = this.settings.highGlow ? 12 : 0;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(this.width, this.groundY);
    ctx.stroke();

    // Perspective Grid Speed Lines
    ctx.strokeStyle = gridLineColor;
    ctx.shadowColor = gridGlow;
    ctx.shadowBlur = this.settings.highGlow ? 6 : 0;
    ctx.lineWidth = 1.5;

    // Moving horizontal grid lines
    const gridSpacing = 20;
    const offset = (this.bgLayer3X * 2) % gridSpacing;
    for (let y = this.groundY + offset; y < this.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }

  // DRAW OBSTACLES
  private drawObstacles() {
    const ctx = this.ctx;

    this.obstacles.forEach((obs) => {
      ctx.save();
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = this.settings.highGlow ? 15 : 0;

      if (obs.type === 'spike') {
        // Plasma Spike
        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(obs.x + 8, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y + 12);
        ctx.lineTo(obs.x + obs.width - 8, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
      } else if (obs.type === 'drone') {
        // Security Cyber Drone
        const pulse = Math.sin(Date.now() * 0.008 + obs.pulseOffset) * 4;

        ctx.fillStyle = '#111';
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 3;

        // Drone body
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.width / 2, obs.y + obs.height / 2 + pulse, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glowing Drone Eye
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2 + pulse, 7, 0, Math.PI * 2);
        ctx.fill();

        // Bottom laser scanner
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.6)';
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y + obs.height / 2 + pulse);
        ctx.lineTo(obs.x + obs.width / 2, this.groundY);
        ctx.stroke();
      } else if (obs.type === 'laser') {
        // Overhead Laser Beam (Must slide under)
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Core line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x + 6, obs.y, obs.width - 12, obs.height);
      } else if (obs.type === 'wall') {
        // Cyber Glitch Wall
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Glitch lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let l = obs.y + 10; l < obs.y + obs.height; l += 15) {
          ctx.beginPath();
          ctx.moveTo(obs.x, l);
          ctx.lineTo(obs.x + obs.width, l);
          ctx.stroke();
        }
      }

      ctx.restore();
    });
  }

  // DRAW ORBS & GEMS
  private drawOrbs() {
    const ctx = this.ctx;

    this.orbs.forEach((orb) => {
      ctx.save();
      ctx.shadowColor = orb.color;
      ctx.shadowBlur = this.settings.highGlow ? 16 : 0;

      if (orb.type === 'gem') {
        // Diamond Gem
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.moveTo(orb.x, orb.y - orb.radius);
        ctx.lineTo(orb.x + orb.radius, orb.y);
        ctx.lineTo(orb.x, orb.y + orb.radius);
        ctx.lineTo(orb.x - orb.radius, orb.y);
        ctx.closePath();
        ctx.fill();

        // Inner white shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orb.x - 2, orb.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Power-Up Sphere
        const grad = ctx.createRadialGradient(orb.x, orb.y, 2, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, orb.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        // Outer Orbiting Ring
        const angle = Date.now() * 0.005 + orb.floatOffset;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(orb.x, orb.y, orb.radius + 6, orb.radius / 2, angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  // DRAW PLAYER CHARACTER (THE MJ CYBER RUNNER)
  private drawPlayer() {
    const ctx = this.ctx;
    const p = this.player;

    ctx.save();
    ctx.translate(p.x, p.y);

    // Active Shield Energy Sphere
    if (this.stats.hasShield) {
      ctx.save();
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.width / 2, p.height / 2, Math.max(p.width, p.height) * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Powerup Aura Glow
    if (this.stats.activePowerUp) {
      ctx.shadowColor = this.stats.activePowerUp.type === 'multiplier' ? '#ffcc00' : '#00ffff';
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = this.settings.highGlow ? 10 : 0;
    }

    if (p.isSliding) {
      // SLIDING / DUCKING POSE (Anti-gravity lean slide)
      // Body Silhouette
      ctx.fillStyle = '#08081a';
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;

      // Sliding Torso
      ctx.beginPath();
      ctx.ellipse(p.width / 2, p.height / 2, p.width / 2, p.height / 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cyber Boots Thrusters Sparks
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(-10, p.height - 8, 12, 6);

      // Silver Fedora Hat
      ctx.fillStyle = '#e6e6fa';
      ctx.fillRect(p.width - 12, 0, 18, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(p.width - 8, 0, 10, 4);

    } else {
      // RUNNING / JUMPING / MOONWALKING POSE
      const isMoonwalk = p.moonwalkTimer > 0 || (this.stats.activePowerUp?.type === 'gravity' && !p.isGrounded);

      if (isMoonwalk) {
        // Moonwalk Pose (Facing backward while gliding smoothly forward!)
        ctx.scale(-1, 1); // Flip facing direction
        ctx.translate(-p.width, 0);
      }

      // Theme colors based on equipped skin
      let legStroke = '#00f3ff';
      let torsoColor1 = '#12002b';
      let torsoColor2 = '#ff00ff';
      let hatColor = '#e6e6fa';
      let hatBand = '#000000';
      let gloveColor = '#ffffff';

      if (this.equippedSkin === 'gold_mj') {
        legStroke = '#ffd700';
        torsoColor1 = '#4a3b00';
        torsoColor2 = '#ffd700';
        hatColor = '#ffee77';
        hatBand = '#b38f00';
        gloveColor = '#ffd700';
      } else if (this.equippedSkin === 'smooth_criminal') {
        legStroke = '#00f3ff';
        torsoColor1 = '#ffffff';
        torsoColor2 = '#e2e8f0';
        hatColor = '#ffffff';
        hatBand = '#000000';
        gloveColor = '#00f3ff';
      } else if (this.equippedSkin === 'mecha_mj') {
        legStroke = '#f43f5e';
        torsoColor1 = '#0f172a';
        torsoColor2 = '#334155';
        hatColor = '#475569';
        hatBand = '#f43f5e';
        gloveColor = '#f43f5e';
      } else if (this.equippedSkin === 'thriller_cyborg') {
        legStroke = '#ef4444';
        torsoColor1 = '#450a0a';
        torsoColor2 = '#7f1d1d';
        hatColor = '#18181b';
        hatBand = '#ef4444';
        gloveColor = '#ff0033';
      }

      // 1. Legs (Animated or Jumping stance)
      ctx.strokeStyle = legStroke;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      if (!p.isGrounded) {
        // Jump / Dunk Arc Stance
        ctx.beginPath();
        ctx.moveTo(p.width * 0.3, p.height * 0.5);
        ctx.lineTo(p.width * 0.1, p.height * 0.8);
        ctx.lineTo(p.width * 0.3, p.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.width * 0.6, p.height * 0.5);
        ctx.lineTo(p.width * 0.8, p.height * 0.85);
        ctx.lineTo(p.width * 0.9, p.height);
        ctx.stroke();
      } else {
        // Running Leg Cycle
        const runPhase = (p.animFrame / 6) * Math.PI * 2;
        const leg1X = Math.sin(runPhase) * 16;
        const leg2X = -Math.sin(runPhase) * 16;

        // Leg 1
        ctx.beginPath();
        ctx.moveTo(p.width * 0.4, p.height * 0.5);
        ctx.lineTo(p.width * 0.4 + leg1X, p.height);
        ctx.stroke();

        // Leg 2
        ctx.beginPath();
        ctx.moveTo(p.width * 0.6, p.height * 0.5);
        ctx.lineTo(p.width * 0.6 + leg2X, p.height);
        ctx.stroke();
      }

      // 2. Cyber Jacket Torso
      const torsoGrad = ctx.createLinearGradient(0, p.height * 0.2, 0, p.height * 0.6);
      torsoGrad.addColorStop(0, torsoColor1);
      torsoGrad.addColorStop(1, torsoColor2);

      ctx.fillStyle = torsoGrad;
      ctx.fillRect(p.width * 0.25, p.height * 0.2, p.width * 0.5, p.height * 0.35);

      // Jacket Neon Trims
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.width * 0.25, p.height * 0.2, p.width * 0.5, p.height * 0.35);

      // 3. Head & Fedora Hat
      ctx.fillStyle = '#10002b';
      ctx.beginPath();
      ctx.arc(p.width * 0.5, p.height * 0.15, 11, 0, Math.PI * 2);
      ctx.fill();

      // Iconic Silver Fedora Hat Tipped Forward
      ctx.fillStyle = hatColor;
      ctx.beginPath();
      ctx.ellipse(p.width * 0.52, p.height * 0.1, 16, 5, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Black Hat Band
      ctx.fillStyle = hatBand;
      ctx.fillRect(p.width * 0.35, p.height * 0.05, 14, 4);

      // 4. Arms & Glowing White Cyber Glove
      ctx.strokeStyle = legStroke;
      ctx.lineWidth = 3.5;

      // Arm 1
      ctx.beginPath();
      ctx.moveTo(p.width * 0.4, p.height * 0.25);
      ctx.lineTo(p.width * 0.8, p.height * 0.35);
      ctx.stroke();

      // Glowing White Cyber Glove
      ctx.fillStyle = gloveColor;
      ctx.shadowColor = gloveColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.width * 0.82, p.height * 0.35, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // DRAW PARTICLES & TEXT
  private drawParticles() {
    const ctx = this.ctx;

    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = this.settings.highGlow ? 10 : 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  private drawFloatingTexts() {
    const ctx = this.ctx;

    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `bold ${ft.fontSize}px sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = this.settings.highGlow ? 12 : 0;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }
}
