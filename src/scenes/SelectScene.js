import * as Phaser from 'phaser';
import {
  CHARACTERS,
  DEFAULT_P1_INDEX,
  DEFAULT_P2_INDEX,
  createMatchConfig,
  getCpuOpponent,
} from '../config/characters.js';
import { COLORS, FONTS, GAME_HEIGHT, GAME_WIDTH, MODES, SCENES } from '../config/constants.js';
import { P1_SELECT_KEYS, P2_SELECT_KEYS, SHARED_KEYS } from '../config/controls.js';
import { anyJustDown, createJustDownMap } from '../systems/InputMap.js';
import { SelectGrid, moveOnGrid } from '../ui/SelectGrid.js';

export class SelectScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.SELECT });
  }

  init(data = {}) {
    this.mode = data.mode === MODES.ARCADE ? MODES.ARCADE : MODES.VERSUS;
    this.isArcade = this.mode === MODES.ARCADE;
    this.startingMatch = false;
    this.players = {
      p1: { index: DEFAULT_P1_INDEX, locked: false },
      p2: { index: DEFAULT_P2_INDEX, locked: false },
    };
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.navy);

    this.add
      .text(GAME_WIDTH / 2, 150, 'CHOOSE YOUR', {
        fontFamily: FONTS.display,
        fontSize: '56px',
        color: '#ff9f2a',
        stroke: '#000000',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 248, 'FIGHTER', {
        fontFamily: FONTS.display,
        fontSize: '140px',
        color: '#ff9f2a',
        stroke: '#000000',
        strokeThickness: 12,
      })
      .setOrigin(0.5);

    this.grid = new SelectGrid(this, CHARACTERS);
    this.grid.create();

    this.p1Preview = this.add.image(340, 880, 'easy-e-preview').setOrigin(0.5, 1);
    this.p2Preview = this.add.image(1588, 880, 'robgob-preview').setOrigin(0.5, 1);

    this.p1Name = this.add
      .text(340, 930, '', {
        fontFamily: FONTS.display,
        fontSize: '56px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.p2Name = this.add
      .text(1588, 930, '', {
        fontFamily: FONTS.display,
        fontSize: '56px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.p1Role = this.add
      .text(340, 988, 'PLAYER 1', {
        fontFamily: FONTS.body,
        fontSize: '20px',
        color: '#ffd54a',
      })
      .setOrigin(0.5);

    this.p2Role = this.add
      .text(1588, 988, this.isArcade ? 'CPU' : 'PLAYER 2', {
        fontFamily: FONTS.body,
        fontSize: '20px',
        color: this.isArcade ? '#8ea0c8' : '#ff4fc5',
      })
      .setOrigin(0.5);

    this.p1Ready = this.add
      .text(340, 200, '', {
        fontFamily: FONTS.display,
        fontSize: '40px',
        color: '#ffd54a',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.p2Ready = this.add
      .text(1588, 200, '', {
        fontFamily: FONTS.display,
        fontSize: '40px',
        color: '#ff4fc5',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const hint = this.isArcade
      ? 'P1  WASD  MOVE   ·   F  OR  SPACE  CONFIRM   ·   ESC  BACK'
      : 'P1  WASD + F     P2  ARROWS + ENTER     ESC  BACK';

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 36, hint, {
        fontFamily: FONTS.body,
        fontSize: '20px',
        color: '#8ea0c8',
      })
      .setOrigin(0.5);

    this.p1Keys = createJustDownMap(this, P1_SELECT_KEYS);
    this.p2Keys = createJustDownMap(this, P2_SELECT_KEYS);
    this.sharedKeys = createJustDownMap(this, SHARED_KEYS);
    this.input.keyboard.addCapture(
      'W,A,S,D,F,SPACE,UP,DOWN,LEFT,RIGHT,ENTER,ESC'
    );

    this.refresh();
    console.info('[SelectScene] Mode:', this.mode);
  }

  update() {
    if (this.startingMatch) {
      return;
    }

    this.handlePlayerInput('p1', this.p1Keys);

    if (!this.isArcade) {
      this.handlePlayerInput('p2', this.p2Keys);
    }

    if (this.sharedKeys.back()) {
      this.handleBack();
    }
  }

  handlePlayerInput(playerId, keys) {
    const player = this.players[playerId];

    if (anyJustDown(keys, ['left'])) {
      this.tryMove(playerId, -1, 0);
    } else if (anyJustDown(keys, ['right'])) {
      this.tryMove(playerId, 1, 0);
    } else if (anyJustDown(keys, ['up'])) {
      this.tryMove(playerId, 0, -1);
    } else if (anyJustDown(keys, ['down'])) {
      this.tryMove(playerId, 0, 1);
    }

    if (anyJustDown(keys, ['confirm', 'confirmAlt'])) {
      if (player.locked) {
        player.locked = false;
        this.refresh();
        return;
      }
      this.tryLock(playerId);
    }
  }

  tryMove(playerId, dx, dy) {
    const player = this.players[playerId];
    if (player.locked) {
      return;
    }

    player.index = moveOnGrid(player.index, dx, dy);
    this.refresh();
  }

  tryLock(playerId) {
    const player = this.players[playerId];
    const character = CHARACTERS[player.index];

    if (!character?.selectable) {
      this.grid.flashDenied(player.index);
      console.info('[SelectScene]', character?.id, 'is not selectable yet');
      return;
    }

    player.locked = true;

    if (this.isArcade) {
      const cpu = getCpuOpponent(character.id);
      const cpuIndex = CHARACTERS.findIndex((entry) => entry.id === cpu?.id);
      this.players.p2.index = cpuIndex >= 0 ? cpuIndex : DEFAULT_P2_INDEX;
      this.players.p2.locked = true;
    }

    this.refresh();
    this.maybeStartMatch();
  }

  handleBack() {
    const someoneLocked = this.players.p1.locked || this.players.p2.locked;

    if (someoneLocked) {
      this.players.p1.locked = false;
      this.players.p2.locked = false;
      this.refresh();
      return;
    }

    this.scene.start(SCENES.TITLE);
  }

  maybeStartMatch() {
    const p1Ready = this.players.p1.locked;
    const p2Ready = this.isArcade || this.players.p2.locked;

    if (!p1Ready || !p2Ready) {
      return;
    }

    this.startingMatch = true;
    const match = createMatchConfig({
      mode: this.mode,
      p1Id: CHARACTERS[this.players.p1.index].id,
      p2Id: CHARACTERS[this.players.p2.index].id,
    });

    console.info('[SelectScene] Match ready', match.p1.id, 'vs', match.p2.id);
    this.time.delayedCall(450, () => {
      this.scene.start(SCENES.GAME, match);
    });
  }

  refresh() {
    if (this.isArcade && !this.players.p1.locked) {
      const hovered = CHARACTERS[this.players.p1.index];
      const cpu = hovered?.selectable ? getCpuOpponent(hovered.id) : null;
      if (cpu) {
        const cpuIndex = CHARACTERS.findIndex((entry) => entry.id === cpu.id);
        this.players.p2.index = cpuIndex >= 0 ? cpuIndex : DEFAULT_P2_INDEX;
      }
    }

    const p1 = CHARACTERS[this.players.p1.index];
    const p2 = CHARACTERS[this.players.p2.index];

    this.grid.drawCursors(
      this.players.p1.index,
      this.players.p2.index,
      !this.isArcade
    );

    this.updateSide('p1', p1, this.p1Preview, this.p1Name, this.p1Ready);
    this.updateSide('p2', p2, this.p2Preview, this.p2Name, this.p2Ready);
  }

  updateSide(playerId, character, preview, nameText, readyText) {
    const locked = this.players[playerId].locked;
    const textureKey = character.preview || 'locked-preview';

    if (this.textures.exists(textureKey)) {
      preview.setTexture(textureKey).setVisible(true);
      preview.setAlpha(character.selectable ? 1 : 0.55);
    } else {
      preview.setVisible(false);
    }

    nameText.setText(character.name);
    readyText.setText(locked ? 'READY' : '');
  }
}
