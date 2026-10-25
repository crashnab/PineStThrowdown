import * as Phaser from 'phaser';
import { CHARACTERS } from '../config/characters.js';
import { COLORS, FONTS, SCENES } from '../config/constants.js';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@500;700&display=swap';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {
    this.cameras.main.setBackgroundColor('#000000');
    this.add
      .text(960, 540, 'LOADING', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '28px',
        color: '#8ea0c8',
      })
      .setOrigin(0.5);

    this.load.on('loaderror', (file) => {
      console.warn('[BootScene] Missing asset', file.key, file.url);
    });

    CHARACTERS.forEach((character) => {
      this.load.image(
        character.portrait,
        `assets/characters/${character.id}/portrait.png`
      );

      if (character.preview) {
        this.load.image(
          character.preview,
          `assets/characters/${character.id}/preview.png`
        );
      }
    });
  }

  async create() {
    await this.waitForFonts();
    this.createLockedPreview();
    this.warnMissingCharacterArt();
    console.info('[BootScene] Assets ready, going to Title.');
    this.scene.start(SCENES.TITLE);
  }

  async waitForFonts() {
    try {
      if (!document.getElementById('throwdown-fonts')) {
        const link = document.createElement('link');
        link.id = 'throwdown-fonts';
        link.rel = 'stylesheet';
        link.href = FONT_URL;
        document.head.appendChild(link);
      }

      if (document.fonts?.load) {
        await Promise.all([
          document.fonts.load(`80px ${FONTS.display}`),
          document.fonts.load(`24px ${FONTS.body}`),
        ]);
      }
    } catch (error) {
      console.warn('[BootScene] Custom fonts did not load. Using fallbacks.', error);
    }
  }

  createLockedPreview() {
    if (this.textures.exists('locked-preview')) {
      return;
    }

    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(COLORS.navy, 1);
    graphics.fillRoundedRect(0, 0, 280, 560, 16);
    graphics.lineStyle(6, COLORS.muted, 1);
    graphics.strokeRoundedRect(8, 8, 264, 544, 12);
    graphics.fillStyle(COLORS.muted, 1);
    graphics.fillCircle(140, 220, 48);
    graphics.generateTexture('locked-preview', 280, 560);
    graphics.destroy();
  }

  warnMissingCharacterArt() {
    CHARACTERS.forEach((character) => {
      if (!this.textures.exists(character.portrait)) {
        console.warn('[BootScene] Portrait missing for', character.id);
      }
    });
  }
}
