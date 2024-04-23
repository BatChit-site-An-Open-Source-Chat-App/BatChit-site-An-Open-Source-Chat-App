const colors = [
  "#0dd37c",
  "#00477e",
  "#e11656",
  "#4c8c75",
  "#082e44",
  "#fe914b",
  "#28a4d3",
  "#879ce8",
  "#fa4682",
  "#be2d09",
];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export const getDifferentBgColour = () => {
  const randomColor = getRandomColor();
  return randomColor;
};
