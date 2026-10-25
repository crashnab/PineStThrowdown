import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config/constants.js';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { SelectScene } from './scenes/SelectScene.js';
import { TitleScene } from './scenes/TitleScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000',
  banner: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, SelectScene, GameScene],
};

function showBootError(error) {
  console.error('[Pine St Throwdown] Failed to start Phaser.', error);

  const gameRoot = document.getElementById('game');
  const errorEl = document.getElementById('boot-error');

  if (gameRoot) {
    gameRoot.style.display = 'none';
  }

  if (errorEl) {
    errorEl.style.display = 'block';
  }
}

function confirmBootCanvas(game) {
  const canvas = game.canvas;
  const ready =
    canvas instanceof HTMLCanvasElement &&
    canvas.width === GAME_WIDTH &&
    canvas.height === GAME_HEIGHT;

  if (!ready) {
    showBootError(
      new Error(
        `Expected a ${GAME_WIDTH}x${GAME_HEIGHT} canvas, got ${canvas?.width}x${canvas?.height}.`
      )
    );
    return;
  }

  console.info(
    `[Pine St Throwdown] Boot canvas ready: ${canvas.width}x${canvas.height}`
  );
}

try {
  const game = new Phaser.Game(config);

  // Boot can finish during `new Phaser.Game()` when the DOM is already ready.
  if (game.isBooted) {
    confirmBootCanvas(game);
  } else {
    game.events.once('ready', () => confirmBootCanvas(game));
  }
} catch (error) {
  showBootError(error);
}
