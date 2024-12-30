export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Load the Tiled map JSON
    this.load.tilemapTiledJSON('overworld', 'assets/tilemaps/overworld.json');

    // Load the tileset image (must match what you used in Tiled)
    this.load.image('dungeon_tiles', 'assets/sprites/dungeon_tiles.png');

    // Load your hero sprite (a simple 3-4 frame walk cycle if available)
    // For now, assume each frame is 32x32
    this.load.spritesheet('hero', 'assets/sprites/hero.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    // --- CREATE TILEMAP ---
    const map = this.make.tilemap({ key: 'overworld' });
    const tileset = map.addTilesetImage('dungeon_tiles', 'dungeon_tiles');
    // 'Ground' is whatever layer name you used in Tiled
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);

    // If you set 'collides=true' in Tiled for certain tiles:
    groundLayer.setCollisionByProperty({ collides: true });

    // --- CREATE PLAYER ---
    this.player = this.physics.add.sprite(100, 100, 'hero', 0);
    this.player.setCollideWorldBounds(true);

    // Collide the player with the collidable tiles
    this.physics.add.collider(this.player, groundLayer);

    // --- CREATE SIMPLE ANIMATIONS ---
    // Let's assume frames 0-3 are walking down, 4-7 walking left, 8-11 walking right, 12-15 walking up
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    // --- INPUT HANDLING ---
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- CAMERA FOLLOW (Optional for a “Zelda” feel) ---
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    const speed = 100;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize & scale velocity (so diagonal doesn’t go faster)
    this.player.body.velocity.normalize().scale(speed);

    // Update animations based on velocity
    if (this.cursors.left.isDown) {
      this.player.anims.play('walk_left', true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('walk_right', true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('walk_up', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('walk_down', true);
    } else {
      // If no movement, stop animation on the first frame of current direction
      this.player.anims.stop();

      // Optionally set a “stand” frame depending on the last movement direction
      if (prevVelocity.x < 0) this.player.setFrame(4);   // left
      else if (prevVelocity.x > 0) this.player.setFrame(8);   // right
      else if (prevVelocity.y < 0) this.player.setFrame(12);  // up
      else if (prevVelocity.y > 0) this.player.setFrame(0);   // down
    }
  }
}
