/**
 * Keyboard helpers.
 *
 * Phaser Key objects are used when they work. We also listen to native
 * keydown on the canvas/window because some browsers only deliver keys
 * after the canvas is focused, and JustDown can miss a tap.
 */

const ALIASES = {
  up: ['w', 'arrowup'],
  down: ['s', 'arrowdown'],
  left: ['a', 'arrowleft'],
  right: ['d', 'arrowright'],
  confirm: ['enter', ' ', 'space', 'spacebar', 'f'],
  confirmP1: ['f', ' '],
  confirmP2: ['enter'],
  back: ['escape'],
};

function normalizeKey(event) {
  if (event.key === ' ') {
    return ' ';
  }
  return String(event.key || '').toLowerCase();
}

export function focusGameCanvas(scene) {
  const canvas = scene.game?.canvas;
  if (!canvas) {
    return;
  }

  canvas.setAttribute('tabindex', '0');
  canvas.style.outline = 'none';
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  canvas.focus();
}

/**
 * Call `handlers[action]()` when any alias for that action is pressed.
 * Example: bindActions(scene, { up: () => move(-1), confirm: () => start() })
 */
export function bindActions(scene, handlers) {
  const pressed = new Set();

  const onDown = (event) => {
    const key = normalizeKey(event);
    if (pressed.has(key)) {
      return;
    }
    pressed.add(key);

    for (const [action, fn] of Object.entries(handlers)) {
      const aliases = ALIASES[action] ?? [action];
      if (aliases.includes(key)) {
        event.preventDefault();
        fn();
        break;
      }
    }
  };

  const onUp = (event) => {
    pressed.delete(normalizeKey(event));
  };

  scene.input.keyboard.on('keydown', onDown);
  scene.input.keyboard.on('keyup', onUp);
  scene.events.once('shutdown', () => {
    scene.input.keyboard.off('keydown', onDown);
    scene.input.keyboard.off('keyup', onUp);
  });
}

export function bindPlayerActions(scene, playerId, handlers) {
  const prefix = playerId === 'p1' ? 'p1' : 'p2';
  const map =
    prefix === 'p1'
      ? {
          up: ['w'],
          down: ['s'],
          left: ['a'],
          right: ['d'],
          confirm: ['f', ' '],
        }
      : {
          up: ['arrowup'],
          down: ['arrowdown'],
          left: ['arrowleft'],
          right: ['arrowright'],
          confirm: ['enter'],
        };

  const pressed = new Set();

  const onDown = (event) => {
    const key = normalizeKey(event);
    if (pressed.has(key)) {
      return;
    }
    pressed.add(key);

    for (const [action, fn] of Object.entries(handlers)) {
      if ((map[action] ?? []).includes(key)) {
        event.preventDefault();
        fn();
        break;
      }
    }
  };

  const onUp = (event) => {
    pressed.delete(normalizeKey(event));
  };

  scene.input.keyboard.on('keydown', onDown);
  scene.input.keyboard.on('keyup', onUp);
  scene.events.once('shutdown', () => {
    scene.input.keyboard.off('keydown', onDown);
    scene.input.keyboard.off('keyup', onUp);
  });
}
