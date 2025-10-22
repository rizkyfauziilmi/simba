export const themes = {
  default: {
    name: "Default",
    description: "Tema bawaan aplikasi",
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
      "Tema terinspirasi Studio Ghibli: lembut, hangat, dan penuh warna.",
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
  corporate: {
    name: "Corporate",
    description: "Tema profesional dan modern untuk lingkungan bisnis.",
    modes: {
      light: {
        value: "corporate-light",
        name: "Corporate Light",
        description: "Tema Corporate (terang)",
        colors: [
          "oklch(0.48 0.2 260.47)", // --primary
          "oklch(0.97 0 0)", // --secondary
          "oklch(0.95 0.02 260.18)", // --accent
          "oklch(0.93 0.01 261.82)", // --border
        ],
      },
      dark: {
        value: "corporate-dark",
        name: "Corporate Dark",
        description: "Tema Corporate (gelap)",
        colors: [
          "oklch(0.56 0.24 260.92)", // --primary
          "oklch(0.35 0.04 261.4)", // --secondary
          "oklch(0.33 0.04 264.63)", // --accent
          "oklch(0.35 0.04 261.4)", // --border
        ],
      },
    },
  },
  "art-deco": {
    name: "Art Deco",
    description: "Tema bergaya art-deco, elegan dan klasik.",
    modes: {
      light: {
        value: "art-deco-light",
        name: "Art Deco Light",
        description: "Tema Art Deco (terang)",
        colors: [
          "oklch(0.77 0.14 91.27)", // --primary
          "oklch(0.67 0.13 61.58)", // --secondary
          "oklch(0.89 0.18 95.47)", // --accent
          "oklch(0.83 0.11 93.01)", // --border
        ],
      },
      dark: {
        value: "art-deco-dark",
        name: "Art Deco Dark",
        description: "Tema Art Deco (gelap)",
        colors: [
          "oklch(0.84 0.17 83.07)", // --primary
          "oklch(0.47 0.11 50.64)", // --secondary
          "oklch(0.66 0.14 79.74)", // --accent
          "oklch(0.47 0.11 50.64)", // --border
        ],
      },
    },
  },
  "neo-brutalism": {
    name: "Neo Brutalism",
    description: "Tema neo-brutalism, tegas dan berani.",
    modes: {
      light: {
        value: "neo-brutalism-light",
        name: "Neo Brutalism Light",
        description: "Tema Neo Brutalism (terang)",
        colors: [
          "oklch(0.65 0.24 26.92)", // --primary
          "oklch(0.97 0.21 109.74)", // --secondary
          "oklch(0.56 0.24 260.83)", // --accent
          "oklch(0 0 0)", // --border
        ],
      },
      dark: {
        value: "neo-brutalism-dark",
        name: "Neo Brutalism Dark",
        description: "Tema Neo Brutalism (gelap)",
        colors: [
          "oklch(0.7 0.19 23.04)", // --primary
          "oklch(0.97 0.2 109.61)", // --secondary
          "oklch(0.68 0.18 251.63)", // --accent
          "oklch(1 0 0)", // --border
        ],
      },
    },
  },
  nature: {
    name: "Nature",
    description: "Tema alam, segar dan natural.",
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
};
