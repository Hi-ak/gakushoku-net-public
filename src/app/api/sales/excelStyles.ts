export const BORDER_AROUND = {
  border: {
    top: {
      style: "thin",
      color: { auto: 1 },
    },
    left: {
      style: "thin",
      color: { auto: 1 },
    },
    right: {
      style: "thin",
      color: { auto: 1 },
    },
    bottom: {
      style: "thin",
      color: { auto: 1 },
    },
  },
};

export const SUNDAY = {
  font: {
    color: {
      rgb: "FF0000",
    },
  },
};

export const SATURDAY = {
  font: {
    color: {
      rgb: "0000FF",
    },
  },
};

export const TATEGAKI = {
  alignment: {
    vertical: "center",
    textRotation: 255,
  },
};

export const BROWN_BG = {
  fill: {
    patternType: "solid",
    fgColor: { theme: 9, tint: -0.249977111117893, rgb: "F7CEA0" },
    // bgColor: { theme: 5, tint: 0.3999755851924192, rgb: "C0504D" },
    bgColor: { rgb: "F7CEA0" },
  },
};

export const getWeekday = (dayIdx: number) => {
  return ["日", "月", "火", "水", "木", "金", "土"][dayIdx];
};
