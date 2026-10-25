/**
 * Portrait grid positions are copied from the 1920x1080 select mockup
 * so the screen stays aligned when we swap in official assets later.
 *
 * Layout:
 *   0  1  2  3
 *     4  5  6
 */
export const PORTRAIT_SLOTS = [
  { x: 597, y: 393 },
  { x: 785, y: 394 },
  { x: 971, y: 394 },
  { x: 1156, y: 394 },
  { x: 692, y: 617 },
  { x: 878, y: 617 },
  { x: 1065, y: 617 },
];

const TOP_ROW = [0, 1, 2, 3];
const BOTTOM_ROW = [4, 5, 6];
const DOWN_FROM_TOP = [4, 5, 5, 6];
const UP_FROM_BOTTOM = [0, 1, 3];

export function moveOnGrid(index, dx, dy) {
  if (dy === -1) {
    if (index < 4) {
      return index;
    }
    return UP_FROM_BOTTOM[index - 4];
  }

  if (dy === 1) {
    if (index >= 4) {
      return index;
    }
    return DOWN_FROM_TOP[index];
  }

  const row = index < 4 ? TOP_ROW : BOTTOM_ROW;
  const rowIndex = row.indexOf(index);
  const next = (rowIndex + dx + row.length) % row.length;
  return row[next];
}

export class SelectGrid {
  constructor(scene, characters) {
    this.scene = scene;
    this.characters = characters;
    this.portraits = [];
    this.cursors = { p1: null, p2: null };
  }

  create() {
    this.characters.forEach((character, index) => {
      const slot = PORTRAIT_SLOTS[index];
      const image = this.scene.add.image(slot.x, slot.y, character.portrait);
      image.setOrigin(0, 0);
      image.setData('index', index);
      this.portraits.push(image);
    });

    this.cursors.p1 = this.createCursor(0xffd54a, 8);
    this.cursors.p2 = this.createCursor(0xff4fc5, 5);
  }

  createCursor(color, thickness) {
    const graphics = this.scene.add.graphics();
    graphics.setData('color', color);
    graphics.setData('thickness', thickness);
    graphics.setDepth(10);
    return graphics;
  }

  drawCursors(p1Index, p2Index, showP2) {
    this.drawCursor(this.cursors.p1, p1Index, 6);
    if (showP2) {
      this.cursors.p2.setVisible(true);
      const inset = p1Index === p2Index ? 10 : 6;
      this.drawCursor(this.cursors.p2, p2Index, inset);
    } else {
      this.cursors.p2.setVisible(false);
    }
  }

  drawCursor(cursor, index, inset) {
    const portrait = this.portraits[index];
    if (!portrait) {
      return;
    }

    const color = cursor.getData('color');
    const thickness = cursor.getData('thickness');

    cursor.clear();
    cursor.lineStyle(thickness, color, 1);
    cursor.strokeRoundedRect(
      portrait.x - inset,
      portrait.y - inset,
      portrait.displayWidth + inset * 2,
      portrait.displayHeight + inset * 2,
      10
    );
  }

  flashDenied(index) {
    const portrait = this.portraits[index];
    if (!portrait) {
      return;
    }

    this.scene.tweens.add({
      targets: portrait,
      alpha: 0.35,
      duration: 70,
      yoyo: true,
      repeat: 2,
    });
  }
}
