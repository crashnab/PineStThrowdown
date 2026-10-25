import * as Phaser from 'phaser';
import { createMatchConfig } from '../config/characters.js';
import { COLORS, FONTS, GAME_HEIGHT, GAME_WIDTH, MODES, SCENES } from '../config/constants.js';
import { SHARED_KEYS } from '../config/controls.js';
import { createJustDownMap } from '../systems/InputMap.js';

/**
 * Placeholder fight room. It only proves that Character Select can
 * hand off a match config. Real combat lands in the next step.
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data = {}) {
    this.match = createMatchConfig({
      mode: data.mode === MODES.ARCADE ? MODES.ARCADE : MODES.VERSUS,
      p1Id: data.p1?.id ?? data.p1Id,
      p2Id: data.p2?.id ?? data.p2Id,
    });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x12081f);

    const { mode, p1, p2 } = this.match;
    const modeLabel = mode === MODES.ARCADE ? 'ARCADE' : '2 PLAYER VS';

    this.add
      .text(GAME_WIDTH / 2, 160, modeLabel, {
        fontFamily: FONTS.body,
        fontSize: '24px',
        color: '#8ea0c8',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 320, 'FIGHT', {
        fontFamily: FONTS.display,
        fontSize: '180px',
        color: '#ff9f2a',
        stroke: '#000000',
        strokeThickness: 14,
      })
      .setOrigin(0.5);

    if (this.textures.exists(p1.preview)) {
      this.add.image(420, 900, p1.preview).setOrigin(0.5, 1);
    }

    if (this.textures.exists(p2.preview)) {
      this.add.image(1500, 900, p2.preview).setOrigin(0.5, 1).setFlipX(true);
    }

    this.add
      .text(420, 960, p1.name, {
        fontFamily: FONTS.display,
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(1500, 960, p2.name, {
        fontFamily: FONTS.display,
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 70,
        mode === MODES.VERSUS
          ? 'MATCH STUB  ·  ESC  RETURNS  TO  CHARACTER  SELECT'
          : 'MATCH STUB  ·  ESC  RETURNS  TO  TITLE',
        {
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: '#8ea0c8',
        }
      )
      .setOrigin(0.5);

    this.keys = createJustDownMap(this, SHARED_KEYS);
    this.input.keyboard.addCapture('ESC');
    console.info('[GameScene] Stub match', p1.id, 'vs', p2.id, 'in', mode);
  }

  update() {
    if (!this.keys.back()) {
      return;
    }

    if (this.match.mode === MODES.VERSUS) {
      this.scene.start(SCENES.SELECT, { mode: MODES.VERSUS });
      return;
    }

    this.scene.start(SCENES.TITLE);
  }
}
