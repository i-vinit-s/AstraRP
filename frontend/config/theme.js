const theme = {
  colors: {
    // Base
    background: "#1B1B1B",
    section: "#222222",
    surface: "#292929",
    card: "#2E2E2E",

    // Brand
    primary: "#7A1111",
    primaryHover: "#981B1B",
    primaryLight: "#B42A2A",

    // Text
    white: "#FFFFFF",
    text: "#F5F5F5",
    muted: "#D4D4D8",
    light: "#A1A1AA",

    // UI
    border: "#3A3A3A",
    divider: "#313131",

    // States
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",

    // Effects
    glow: "rgba(122,17,17,.18)",
    glass: "rgba(255,255,255,.04)",

    // Misc
    shadow: "rgba(0,0,0,.35)",
  },

  container: {
    width: "max-w-7xl",
    padding: "px-6 lg:px-8",
  },

  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  },

  navbar: {
    height: "h-20",
    background: "bg-[#1B1B1B]/80",
    border: "border-[#3A3A3A]",
    blur: "backdrop-blur-xl",
  },

  button: {
    primary:
      "bg-[#7A1111] hover:bg-[#981B1B] text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300",

    secondary:
      "border border-[#3A3A3A] bg-transparent hover:bg-white/5 text-white rounded-xl px-6 py-3 transition-all duration-300",
  },

  card: {
    default: "bg-[#2E2E2E] border border-[#3A3A3A] rounded-2xl",

    hover:
      "hover:border-[#7A1111] hover:-translate-y-1 transition-all duration-300",
  },
};

export default theme;
