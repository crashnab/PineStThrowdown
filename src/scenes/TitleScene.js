import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_HEIGHT, GAME_WIDTH, MODES, SCENES } from '../config/constants.js';
import { bindActions, focusGameCanvas } from '../systems/InputMap.js';

const MENU = [
  { label: '1 PLAYER', hint: 'ARCADE', mode: MODES.ARCADE },
  { label: '2 PLAYER', hint: 'VS', mode: MODES.VERSUS },
];

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.TITLE });
    this.selected = 1;
    this.menuTexts = [];
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.navy);
    this.selected = 1;
    focusGameCanvas(this);

    this.add
      .text(GAME_WIDTH / 2, 250, 'PINE ST', {
        fontFamily: FONTS.display,
        fontSize: '72px',
        color: '#ff9f2a',
        stroke: '#000000',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 380, 'THROWDOWN', {
        fontFamily: FONTS.display,
        fontSize: '148px',
        color: '#ff9f2a',
        stroke: '#000000',
        strokeThickness: 12,
      })
      .setOrigin(0.5);

    this.menuTexts = MENU.map((item, index) => {
      const text = this.add
        .text(GAME_WIDTH / 2, 620 + index * 90, `${item.label}   ${item.hint}`, {
          fontFamily: FONTS.display,
          fontSize: '56px',
          stroke: '#000000',
          strokeThickness: 6,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on('pointerover', () => {
        this.selected = index;
        this.refreshMenu();
      });
      text.on('pointerdown', () => {
        this.selected = index;
        this.confirm();
      });
      return text;
    });

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 70,
        'W / S  OR  ARROWS   ·   ENTER  OR  SPACE   ·   OR  CLICK',
        {
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: '#8ea0c8',
        }
      )
      .setOrigin(0.5);

    bindActions(this, {
      up: () => this.move(-1),
      down: () => this.move(1),
      confirm: () => this.confirm(),
    });

    this.refreshMenu();
    console.info('[TitleScene] Ready. Choose Arcade or VS.');
  }

  move(direction) {
    this.selected = (this.selected + direction + MENU.length) % MENU.length;
    this.refreshMenu();
  }

  confirm() {
    const choice = MENU[this.selected];
    console.info('[TitleScene] Starting select in', choice.mode, 'mode');
    this.scene.start(SCENES.SELECT, { mode: choice.mode });
  }

  refreshMenu() {
    this.menuTexts.forEach((text, index) => {
      const active = index === this.selected;
      text.setColor(active ? '#ffd54a' : '#c5d0ea');
      text.setScale(active ? 1.08 : 1);
    });
  }
}
