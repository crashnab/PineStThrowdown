import * as Phaser from 'phaser';
import { COLORS, FONTS, GAME_HEIGHT, GAME_WIDTH, MODES, SCENES } from '../config/constants.js';
import { TITLE_KEYS } from '../config/controls.js';
import { anyJustDown, createJustDownMap } from '../systems/InputMap.js';

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
        .text(GAME_WIDTH / 2, 620 + index * 90, '', {
          fontFamily: FONTS.display,
          fontSize: '56px',
          stroke: '#000000',
          strokeThickness: 6,
        })
        .setOrigin(0.5);
      text.setData('index', index);
      return text;
    });

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 70,
        'W / S  OR  ARROWS   ·   ENTER  OR  SPACE  TO  SELECT',
        {
          fontFamily: FONTS.body,
          fontSize: '22px',
          color: '#8ea0c8',
        }
      )
      .setOrigin(0.5);

    this.keys = createJustDownMap(this, TITLE_KEYS);
    this.input.keyboard.addCapture('W,S,UP,DOWN,ENTER,SPACE');
    this.refreshMenu();

    console.info('[TitleScene] Ready. Choose Arcade or VS.');
  }

  update() {
    if (anyJustDown(this.keys, ['up', 'upAlt'])) {
      this.selected = (this.selected + MENU.length - 1) % MENU.length;
      this.refreshMenu();
    }

    if (anyJustDown(this.keys, ['down', 'downAlt'])) {
      this.selected = (this.selected + 1) % MENU.length;
      this.refreshMenu();
    }

    if (anyJustDown(this.keys, ['confirm', 'confirmAlt'])) {
      const choice = MENU[this.selected];
      console.info('[TitleScene] Starting select in', choice.mode, 'mode');
      this.scene.start(SCENES.SELECT, { mode: choice.mode });
    }
  }

  refreshMenu() {
    this.menuTexts.forEach((text, index) => {
      const item = MENU[index];
      const active = index === this.selected;
      text.setText(`${item.label}   ${item.hint}`);
      text.setColor(active ? '#ffd54a' : '#c5d0ea');
      text.setScale(active ? 1.08 : 1);
    });
  }
}
