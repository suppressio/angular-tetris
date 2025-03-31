export const TETRIS = {
    EMPTY_BLOCK: 0,
    BOARD_SIZE: { x: 12, y: 18 } as const,
    DEFAULT_DELAY: 100,
    DEFAULT_VOLUME: 0.8,
    SOUNDS: {
        PAUSE: "pause#.mp3",
        BRICK: "brick#.mp3",
        ROTATE: "whoosh#.mp3",
        MUSIC: "theme-piano.mp3",
    } as const,
} as const;