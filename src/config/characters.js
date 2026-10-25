/**
 * Character roster. Adding a fighter later should mean a new object here
 * plus files under assets/characters/<id>/. Game scenes read this list;
 * they should not hard-code names.
 *
 * Only Easy E and RobGob are selectable in this milestone.
 * The other five slots are already in the grid so the layout matches
 * the mockup. Rename them when you have official names.
 */

export const CHARACTERS = [
  {
    id: 'robgob',
    name: 'ROBGOB',
    selectable: true,
    portrait: 'robgob-portrait',
    preview: 'robgob-preview',
    cursorColor: 0x9b59d0,
  },
  {
    id: 'fighter-02',
    name: '???',
    selectable: false,
    portrait: 'fighter-02-portrait',
    preview: null,
    cursorColor: 0xb9c4d6,
  },
  {
    id: 'fighter-03',
    name: '???',
    selectable: false,
    portrait: 'fighter-03-portrait',
    preview: null,
    cursorColor: 0xe38ad2,
  },
  {
    id: 'easy-e',
    name: 'EASY E',
    selectable: true,
    portrait: 'easy-e-portrait',
    preview: 'easy-e-preview',
    cursorColor: 0xff9f2a,
  },
  {
    id: 'fighter-05',
    name: '???',
    selectable: false,
    portrait: 'fighter-05-portrait',
    preview: null,
    cursorColor: 0x8ea0c8,
  },
  {
    id: 'fighter-06',
    name: '???',
    selectable: false,
    portrait: 'fighter-06-portrait',
    preview: null,
    cursorColor: 0x8ea0c8,
  },
  {
    id: 'mystery',
    name: '???',
    selectable: false,
    portrait: 'mystery-portrait',
    preview: null,
    cursorColor: 0x8ea0c8,
  },
];

export const DEFAULT_P1_INDEX = 3; // Easy E, matching the mockup
export const DEFAULT_P2_INDEX = 0; // RobGob, matching the mockup

export function getCharacter(id) {
  return CHARACTERS.find((character) => character.id === id) ?? null;
}

export function getSelectableCharacters() {
  return CHARACTERS.filter((character) => character.selectable);
}

export function getCpuOpponent(playerId) {
  return (
    CHARACTERS.find(
      (character) => character.selectable && character.id !== playerId
    ) ?? null
  );
}

export function createMatchConfig({ mode, p1Id, p2Id }) {
  const p1 = getCharacter(p1Id);
  const p2 = getCharacter(p2Id);

  if (!p1?.selectable || !p2?.selectable) {
    console.warn('[roster] Invalid match pairing, falling back to Easy E vs RobGob.', {
      mode,
      p1Id,
      p2Id,
    });
    return {
      mode,
      p1: getCharacter('easy-e'),
      p2: getCharacter('robgob'),
    };
  }

  return { mode, p1, p2 };
}
