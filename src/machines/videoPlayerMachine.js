import { createMachine, assign } from "xstate";

export const videoPlayerMachine = createMachine({
  id: "video",
  initial: "closed",
  context: {
    url: "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8",
    playing: false,
    loading: false,
  },
  states: {
    closed: {
      on: {
        OPEN: {
          target: "normal",
          actions: assign({ playing: () => true }),
        },
      },
    },
    normal: {
      on: {
        MINIMIZE: { target: "minimized" },
        CLOSE: {
          target: "closed",
          actions: assign({ playing: () => false }),
        },
        PLAY: {
          actions: assign({ playing: () => true }),
        },
        PAUSE: {
          actions: assign({ playing: () => false }),
        },
        LOAD_START: {
            actions: assign({ loading: () => true })
          },
          LOADED: {
            actions: assign({ loading: () => false })
          }
      },
    },
    minimized: {
      on: {
        MAXIMIZE: { target: "normal" },
        CLOSE: {
          target: "closed",
          actions: assign({ playing: () => false }),
        },
        PLAY: {
          actions: assign({ playing: () => true }),
        },
        PAUSE: {
          actions: assign({ playing: () => false }),
        },
      },
    },
  },
});
