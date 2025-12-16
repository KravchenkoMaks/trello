const usedHues: number[] = [];

export function getRandomColor(): string {
  let hue: number;
  let attempts = 0;

  do {
    hue = Math.floor(Math.random() * 360);
    attempts++;
  } while (usedHues.some((h) => Math.abs(h - hue) < 30) && attempts < 20);

  usedHues.push(hue);
  if (usedHues.length > 10) usedHues.shift();

  const saturation = Math.floor(65 + Math.random() * 30);
  const lightness = Math.floor(40 + Math.random() * 30);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
