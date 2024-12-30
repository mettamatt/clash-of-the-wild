import MainScene from './mainScene.js';

const config = {
  type: Phaser.AUTO,
  width: 400,   // or whatever you prefer
  height: 240,  // a small resolution can feel retro
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [MainScene]
};

new Phaser.Game(config);
