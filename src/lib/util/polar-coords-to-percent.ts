export default function polarCoordsToPercent(angle: number, radius: number) {
 // angle in degrees
 // example: if angle is 0 and r is one
 // the percentages should be 100%, 50%
 // example 2: if angle is 45 and r is 1
 // the percentages should be 50 + sqrt(2) * 50 and 50 - sqrt(2) * 50
 // example 3: if angle is a and r is 1
 // the percentages should be 50 + cos(a) * 50 and 50 - sin(a) * 50
 // example 4: if angle is a and r is b
 // the percentages should be 50 + cos(a) * 50 * b and 50 - sin(a) * 50 * b
 // 180 degrees is pi radians
 const radians = (angle / 180) * Math.PI;
 const horizontalPercent = 50 + Math.cos(radians) * 50 * radius;
 const verticalPercent = 50 - Math.sin(radians) * 50 * radius;

 return {
  horizontalPercent,
  verticalPercent,
 };
}
