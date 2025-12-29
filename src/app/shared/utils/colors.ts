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

  const saturation = Math.floor(60 + Math.random() * 20);
  const lightness = Math.floor(55 + Math.random() * 25);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
