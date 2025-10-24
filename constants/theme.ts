export const themes = {
  default: {
    name: "Default",
    description: "Tampilan standar yang bersih dan netral.",
    modes: {
      light: {
        value: "default-light",
        name: "Default Light",
        description: "Tema bawaan aplikasi (terang)",
        colors: [
          "oklch(0.2 0 0)", // --primary
          "oklch(0.97 0 0)", // --secondary
          "oklch(0.97 0 0)", // --accent
          "oklch(0.92 0 0)", // --border
        ],
      },
      dark: {
        value: "default-dark",
        name: "Default Dark",
        description: "Tema bawaan aplikasi (gelap)",
        colors: [
          "oklch(0.92 0 0)", // --primary
          "oklch(0.27 0 0)", // --secondary
          "oklch(0.27 0 0)", // --accent
          "oklch(1 0 0 / 10%)", // --border
        ],
      },
    },
  },
  ghibli: {
    name: "Ghibli",
    description:
      description: "Lembut, hangat, dan penuh warna seperti film Studio Ghibli.",
    modes: {
      light: {
        value: "ghibli-light",
        name: "Ghibli Light",
        description: "Tema Ghibli (terang)",
        colors: [
          "oklch(0.71 0.1 111.96)", // --primary
          "oklch(0.88 0.05 83.32)", // --secondary
          "oklch(0.86 0.05 85.12)", // --accent
          "oklch(0.74 0.06 79.64)", // --border
        ],
      },
      dark: {
        value: "ghibli-dark",
        name: "Ghibli Dark",
        description: "Tema Ghibli (gelap)",
        colors: [
          "oklch(0.64 0.05 114.58)", // --primary
          "oklch(0.33 0.02 60.7)", // --secondary
          "oklch(0.33 0.02 60.7)", // --accent
          "oklch(0.33 0.02 60.7)", // --border
        ],
      },
    },
  },
  "neo-brutalism": {
    name: "Neo Brutalism",
    description: "Warna-warna kontras dan tegas, cocok untuk gaya modern yang berani.",
    modes: {
      light: {
        value: "neo-brutalism-light",
        name: "Neo Brutalism Light",
        description: "Tema Neo Brutalism (terang)",
        colors: [
          "#ff3333", // --primary
          "#ffff00", // --secondary
          "#0066ff", // --accent
          "#000000", // --border
        ],
      },
      dark: {
        value: "neo-brutalism-dark",
        name: "Neo Brutalism Dark",
        description: "Tema Neo Brutalism (gelap)",
        colors: [
          "#ff6666", // --primary
          "#ffff33", // --secondary
          "#3399ff", // --accent
          "#ffffff", // --border
        ],
      },
    },
  },
  nature: {
    name: "Nature",
    description: "Segar dan natural, terinspirasi dari warna-warna alam.",
    modes: {
      light: {
        value: "nature-light",
        name: "Nature Light",
        description: "Tema Nature (terang)",
        colors: [
          "oklch(0.52 0.13 144.33)", // --primary
          "oklch(0.96 0.02 147.54)", // --secondary
          "oklch(0.9 0.05 146.01)", // --accent
          "oklch(0.88 0.02 77.29)", // --border
        ],
      },
      dark: {
        value: "nature-dark",
        name: "Nature Dark",
        description: "Tema Nature (gelap)",
        colors: [
          "oklch(0.67 0.16 144.06)", // --primary
          "oklch(0.39 0.03 143.09)", // --secondary
          "oklch(0.58 0.14 144.14)", // --accent
          "oklch(0.39 0.03 143.09)", // --border
        ],
      },
    },
  },
  caffeine: {
    name: "Caffeine",
    description: "Hangat dan energik, memberikan semangat seperti kopi.",
    modes: {
      light: {
        value: "caffeine-light",
        name: "Caffeine Light",
        description: "Tema Caffeine (terang)",
        colors: [
          "oklch(0.4341 0.0392 41.9938)", // --primary
          "oklch(0.92 0.0651 74.3695)", // --secondary
          "oklch(0.931 0 0)", // --accent
          "oklch(0.8822 0 0)", // --border
        ],
      },
      dark: {
        value: "caffeine-dark",
        name: "Caffeine Dark",
        description: "Tema Caffeine (gelap)",
        colors: [
          "oklch(0.9247 0.0524 66.1732)", // --primary
          "oklch(0.3163 0.019 63.6992)", // --secondary
          "oklch(0.285 0 0)", // --accent
          "oklch(0.2351 0.0115 91.7467)", // --border
        ],
      },
    },
  },
  "bold-tech": {
    name: "Bold Tech",
    description: "Modern, berani, dan dinamis, cocok untuk nuansa teknologi.",
    modes: {
      light: {
        value: "bold-tech-light",
        name: "Bold Tech Light",
        description: "Tema Bold Tech (terang)",
        colors: [
          "oklch(0.6056 0.2189 292.7172)", // --primary
          "oklch(0.9618 0.0202 295.1913)", // --secondary
          "oklch(0.9319 0.0316 255.5855)", // --accent
          "oklch(0.9299 0.0334 272.7879)", // --border
        ],
      },
      dark: {
        value: "bold-tech-dark",
        name: "Bold Tech Dark",
        description: "Tema Bold Tech (gelap)",
        colors: [
          "oklch(0.6056 0.2189 292.7172)", // --primary
          "oklch(0.2573 0.0861 281.2883)", // --secondary
          "oklch(0.4568 0.2146 277.0229)", // --accent
          "oklch(0.2827 0.1351 291.0894)", // --border
        ],
      },
    },
  },
  "mocha-mousse": {
    name: "Mocha Mousse",
    description: "Lembut dan creamy, memberikan nuansa nyaman seperti dessert coklat.",
    modes: {
      light: {
        value: "mocha-mousse-light",
        name: "Mocha Mousse Light",
        description: "Tema Mocha Mousse (terang)",
        colors: [
          "oklch(0.6083 0.0623 44.3588)", // --primary
          "oklch(0.7473 0.0387 80.5476)", // --secondary
          "oklch(0.8502 0.0389 49.0874)", // --accent
          "oklch(0.7473 0.0387 80.5476)", // --border
        ],
      },
      dark: {
        value: "mocha-mousse-dark",
        name: "Mocha Mousse Dark",
        description: "Tema Mocha Mousse (gelap)",
        colors: [
          "oklch(0.7272 0.0539 52.332)", // --primary
          "oklch(0.5416 0.0512 37.2132)", // --secondary
          "oklch(0.7473 0.0387 80.5476)", // --accent
          "oklch(0.4063 0.0255 40.3627)", // --border
        ],
      },
    },
  },
  catppuccin: {
    name: "Catppuccin",
    description: "Pastel lembut dan harmonis, terinspirasi dari Catppuccin.",
    modes: {
      light: {
        value: "catppuccin-light",
        name: "Catppuccin Light",
        description: "Tema Catppuccin (terang)",
        colors: [
          "oklch(0.5547 0.2503 297.0156)", // --primary
          "oklch(0.8575 0.0145 268.4756)", // --secondary
          "oklch(0.682 0.1448 235.3822)", // --accent
          "oklch(0.8083 0.0174 271.1982)", // --border
        ],
      },
      dark: {
        value: "catppuccin-dark",
        name: "Catppuccin Dark",
        description: "Tema Catppuccin (gelap)",
        colors: [
          "oklch(0.7871 0.1187 304.7693)", // --primary
          "oklch(0.4765 0.034 278.643)", // --secondary
          "oklch(0.8467 0.0833 210.2545)", // --accent
          "oklch(0.324 0.0319 281.9784)", // --border
        ],
      },
    },
  },
};
