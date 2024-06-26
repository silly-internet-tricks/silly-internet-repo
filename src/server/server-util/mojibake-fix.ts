import { TextDecoder } from 'node:util';

// this code is taken from: https://github.com/mathiasbynens/windows-1252/blob/main/src/windows-1252.src.mjs#L73

const indexByCodePoint = new Map([
 [129, 1],
 [141, 13],
 [143, 15],
 [144, 16],
 [157, 29],
 [160, 32],
 [161, 33],
 [162, 34],
 [163, 35],
 [164, 36],
 [165, 37],
 [166, 38],
 [167, 39],
 [168, 40],
 [169, 41],
 [170, 42],
 [171, 43],
 [172, 44],
 [173, 45],
 [174, 46],
 [175, 47],
 [176, 48],
 [177, 49],
 [178, 50],
 [179, 51],
 [180, 52],
 [181, 53],
 [182, 54],
 [183, 55],
 [184, 56],
 [185, 57],
 [186, 58],
 [187, 59],
 [188, 60],
 [189, 61],
 [190, 62],
 [191, 63],
 [192, 64],
 [193, 65],
 [194, 66],
 [195, 67],
 [196, 68],
 [197, 69],
 [198, 70],
 [199, 71],
 [200, 72],
 [201, 73],
 [202, 74],
 [203, 75],
 [204, 76],
 [205, 77],
 [206, 78],
 [207, 79],
 [208, 80],
 [209, 81],
 [210, 82],
 [211, 83],
 [212, 84],
 [213, 85],
 [214, 86],
 [215, 87],
 [216, 88],
 [217, 89],
 [218, 90],
 [219, 91],
 [220, 92],
 [221, 93],
 [222, 94],
 [223, 95],
 [224, 96],
 [225, 97],
 [226, 98],
 [227, 99],
 [228, 100],
 [229, 101],
 [230, 102],
 [231, 103],
 [232, 104],
 [233, 105],
 [234, 106],
 [235, 107],
 [236, 108],
 [237, 109],
 [238, 110],
 [239, 111],
 [240, 112],
 [241, 113],
 [242, 114],
 [243, 115],
 [244, 116],
 [245, 117],
 [246, 118],
 [247, 119],
 [248, 120],
 [249, 121],
 [250, 122],
 [251, 123],
 [252, 124],
 [253, 125],
 [254, 126],
 [255, 127],
 [338, 12],
 [339, 28],
 [352, 10],
 [353, 26],
 [376, 31],
 [381, 14],
 [382, 30],
 [402, 3],
 [710, 8],
 [732, 24],
 [8211, 22],
 [8212, 23],
 [8216, 17],
 [8217, 18],
 [8218, 2],
 [8220, 19],
 [8221, 20],
 [8222, 4],
 [8224, 6],
 [8225, 7],
 [8226, 21],
 [8230, 5],
 [8240, 9],
 [8249, 11],
 [8250, 27],
 [8364, 0],
 [8482, 25],
]);

const encode = (input: string) => {
 const result = new Uint8Array(input.length);
 for (let index = 0; index < input.length; index++) {
  const codePoint = input.charCodeAt(index);
  if (codePoint >= 0x00 && codePoint <= 0x7f) {
   result[index] = codePoint;
  } else if (indexByCodePoint.has(codePoint)) {
   const pointer = indexByCodePoint.get(codePoint) as number;

   result[index] = pointer + 0x80;
  } else {
   console.warn(`no encoding found: ${codePoint} ${String.fromCodePoint(codePoint)}`);
  }
 }

 return result;
};

export default function mojibakeFix(mojibake: string) {
 const decoder = new TextDecoder();
 const fixed = decoder.decode(encode(mojibake));
 console.log(`mojibake      before: ${mojibake} after: ${fixed}`);
 return fixed;
}
