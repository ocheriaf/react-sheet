interface GenerateMatrixOptions {}

export const generateMatrix = (n: number, opts: GenerateMatrixOptions = {}) => {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(defaultGenerateElement());
    }
    matrix.push(row);
  }
  return matrix;
};

export const defaultGenerateElement = (max: number = 100000) => {
  return Math.floor(Math.random() * max);
};
