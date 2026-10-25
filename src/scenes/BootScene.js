import Phaser from 'phaser';

/**
 * BootScene is the first room the game enters.
 * Later this scene will preload shared fonts, atlases, and audio.
 * For this first checkpoint it only proves the 1920x1080 canvas exists.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    console.info('[BootScene] 1920x1080 black canvas is live.');
  }
}
