export function distanceTo(myX:number, myY:number, targetX:number, targetY:number):number {
    const dist = Math.sqrt(Math.pow((targetX - myX),2) + Math.pow((targetY - myY), 2))
    return dist
}

//Helper function for checkRectanglesCollision
// A function to calculate the intersection between two lines
// Returns null if the lines do not intersect, or an object with x and y properties if they do
function getLineIntersection(line1: { x1: number, y1: number, x2: number, y2: number }, line2: { x1: number, y1: number, x2: number, y2: number }) {
    const a = line1.y2 - line1.y1;
    const b = line1.x1 - line1.x2;
    const c = line2.y2 - line2.y1;
    const d = line2.x1 - line2.x2;
    const e = (line1.x1 * line1.y2) - (line1.y1 * line1.x2);
    const f = (line2.x1 * line2.y2) - (line2.y1 * line2.x2);
    const det = (a * d) - (b * c);
  
    if (det === 0) {
      return null;
    } else {
      const x = ((e * d) - (b * f)) / det;
      const y = ((a * f) - (e * c)) / det;
      return { x, y };
    }
  }
  
  // A function to check for collisions between two rotated rectangles
  export function checkRectanglesCollision(rect1: { x: number, y: number, width: number, height: number, angle: number }, rect2: { x: number, y: number, width: number, height: number, angle: number }) {
    // Calculate the corners of each rectangle
    const corners1 = [
      { x: rect1.x - (rect1.width / 2), y: rect1.y - (rect1.height / 2) },
      { x: rect1.x + (rect1.width / 2), y: rect1.y - (rect1.height / 2) },
      { x: rect1.x + (rect1.width / 2), y: rect1.y + (rect1.height / 2) },
      { x: rect1.x - (rect1.width / 2), y: rect1.y + (rect1.height / 2) }
    ];
    const corners2 = [
      { x: rect2.x - (rect2.width / 2), y: rect2.y - (rect2.height / 2) },
      { x: rect2.x + (rect2.width / 2), y: rect2.y - (rect2.height / 2) },
      { x: rect2.x + (rect2.width / 2), y: rect2.y + (rect2.height / 2) },
      { x: rect2.x - (rect2.width / 2), y: rect2.y + (rect2.height / 2) }
    ];
  
    // Rotate the corners of each rectangle by their respective angles
    // Angles are in radians, pretty sure (convert by doing angle * Math.PI / 180)
    for (const corner of corners1) {
        const x = corner.x - rect1.x;
        const y = corner.y - rect1.y;
        corner.x = (x * Math.cos(rect1.angle)) - (y * Math.sin(rect1.angle)) + rect1.x;
        corner.y = (x * Math.sin(rect1.angle)) + (y * Math.cos(rect1.angle)) + rect1.y;
      }
      for (const corner of corners2) {
        const x = corner.x - rect2.x;
        const y = corner.y - rect2.y;
        corner.x = (x * Math.cos(rect2.angle)) - (y * Math.sin(rect2.angle)) + rect2.x;
        corner.y = (x * Math.sin(rect2.angle)) + (y * Math.cos(rect2.angle)) + rect2.y;
      }
    
      // Check for collisions between the edges of the two rectangles
for (let i = 0; i < 4; i++) {
    const line1 = { x1: corners1[i].x, y1: corners1[i].y, x2: corners1[(i + 1) % 4].x, y2: corners1[(i + 1) % 4].y };
    for (let j = 0; j < 4; j++) {
      const line2 = { x1: corners2[j].x, y1: corners2[j].y, x2: corners2[(j + 1) % 4].x, y2: corners2[(j + 1) % 4].y };
  
      // Check for an intersection between the two lines
      const intersection = getLineIntersection(line1, line2);
      if (intersection) {
        // There is an intersection, so the rectangles are colliding
        return true;
      }
    }
  }
  
  // No intersections were found, so the rectangles are not colliding
  return false;
}