export const centerAndContainDrawing = (drawing, width, height) => {
  // Find the minimum and maximum x and y coordinates of the drawing
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  drawing.forEach((path) => {
    path.segments.forEach((segment) => {
      const [x, y] = segment.split(" ").slice(1).map(Number);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  // Calculate the current width and height of the drawing
  const currentWidth = maxX - minX;
  const currentHeight = maxY - minY;

  // Calculate the scale factor to fit the drawing within the provided width and height
  const scaleFactor = Math.min(width / currentWidth, height / currentHeight);

  // Calculate the new x and y coordinates of the drawing to center it within the provided width and height
  const offsetX = (width - currentWidth * scaleFactor) / 2;
  const offsetY = (height - currentHeight * scaleFactor) / 2;

  // Apply the scale factor and offset to each segment of the drawing
  const centeredDrawing = drawing.map((path) => {
    const centeredSegments = path.segments.map((segment) => {
      const [x, y] = segment.split(" ").slice(1).map(Number);
      const centeredX = (x - minX) * scaleFactor + offsetX;
      const centeredY = (y - minY) * scaleFactor + offsetY;
      return `L ${centeredX} ${centeredY}`;
    });
    return { ...path, segments: centeredSegments };
  });

  return centeredDrawing;
};
