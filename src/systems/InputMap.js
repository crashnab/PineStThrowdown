import * as Phaser from 'phaser';

/**
 * Turns a key-name map into "just pressed" helpers.
 * JustDown means the key fires once per tap, so holding W does not
 * race through a menu.
 */
export function createJustDownMap(scene, keyNames) {
  const keys = scene.input.keyboard.addKeys(keyNames);
  const map = {};

  for (const [name, key] of Object.entries(keys)) {
    map[name] = () => Phaser.Input.Keyboard.JustDown(key);
  }

  return map;
}

export function anyJustDown(map, names) {
  return names.some((name) => typeof map[name] === 'function' && map[name]());
}
