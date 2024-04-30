import { MutableRefObject } from "react";

type TtoGrayScale = (r: number, g: number, b: number) => number;
const toGrayScale: TtoGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

type TconvertToGrayScales = (context: CanvasRenderingContext2D | null, width: number, height: number) => number[];
export const convertToGrayScales: TconvertToGrayScales = (context, width, height) => {
    if (!context) return [];

    const grayScales = [];
    const imageData = context.getImageData(0, 0, width, height);
    for (let i = 0 ; i < imageData.data.length ; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

        grayScales.push(grayScale as number);
    }
    context.putImageData(imageData, 0, 0);

    return grayScales;
};

// chars to test -> █ ⣿ ▓
const grayRamp = '¶$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const rampLength = grayRamp.length;

type TgetCharacterForGrayScale = (grayScale: number) => string;
const getCharacterForGrayScale: TgetCharacterForGrayScale = (grayScale) => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];

type TdrawAscii = (
    grayScales: number[],
    width: number,
    height: number,
    ref: MutableRefObject<HTMLPreElement | null>,
    maxW: number,
    maxH: number
) => void;
export const drawAscii: TdrawAscii = (grayScales, width, height, ref, maxW, maxH) => {
    const cantPadTop = (maxH - height) / 2
    const cantPadInline = (maxW - width) / 2

    const padTop = '\n'.repeat(cantPadTop);
    const padInline = ' '.repeat(cantPadInline);

    let ascii = padTop + padInline;
    ascii += grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);
        if ((index + 1) % width === 0) {
            nextChars += `${padInline}\n${padInline}`;
        }

        return asciiImage + nextChars;
    }, '' as string);

    if (ref.current) ref.current.textContent = ascii;
};