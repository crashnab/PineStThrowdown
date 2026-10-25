import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';

// Game resolution stays 1920x1080. FIT + CENTER_BOTH letterboxes this
// onto any window so the fight camera math never changes.
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

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
  scene: [BootScene],
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
