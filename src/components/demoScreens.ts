/* Written by tools/demo-screens.mjs — the pixel sizes of the demo
   screenshots in public/media/screens (2x; w1 is the 1x width). Run the
   script again when the demo changes; do not edit by hand. */
export const DEMO_SCREENS = {
  "en": {
    "desk": {
      "w": 1280,
      "h": 3135,
      "w1": 640
    },
    "phone": {
      "w": 400,
      "h": 3968,
      "w1": 200
    }
  },
  "nl": {
    "desk": {
      "w": 1280,
      "h": 3135,
      "w1": 640
    },
    "phone": {
      "w": 400,
      "h": 3944,
      "w1": 200
    }
  },
  "it": {
    "desk": {
      "w": 1280,
      "h": 3105,
      "w1": 640
    },
    "phone": {
      "w": 400,
      "h": 3949,
      "w1": 200
    }
  }
} as const
