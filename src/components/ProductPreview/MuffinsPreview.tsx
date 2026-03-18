// SVG renderer for muffins product preview.
// Shows an open box with muffin shapes (dome top + cup wrapper) based on boxSize and boxFlavors.

import React from 'react';
import { BOX_ITEM_COLORS } from './previewConstants';

interface MuffinsPreviewProps {
  config: {
    boxSize?: 4 | 6 | 12;
    boxFlavors?: string[];
  };
}

// Grid layouts for each box size
const GRID_LAYOUTS: Record<number, { cols: number; rows: number }> = {
  4: { cols: 2, rows: 2 },
  6: { cols: 3, rows: 2 },
  12: { cols: 4, rows: 3 },
};

export default function MuffinsPreview({ config }: MuffinsPreviewProps) {
  const { boxSize, boxFlavors = [] } = config;
  const isEmpty = !boxSize;

  // Grid dimensions
  const grid = boxSize ? GRID_LAYOUTS[boxSize] : GRID_LAYOUTS[4];
  const totalItems = boxSize || 4;

  // Box dimensions
  const boxX = 20;
  const boxY = 40;
  const boxWidth = 160;
  const boxHeight = 120;

  // Muffin layout inside the box
  const padding = 12;
  const innerWidth = boxWidth - padding * 2;
  const innerHeight = boxHeight - padding * 2;
  const cellWidth = innerWidth / grid.cols;
  const cellHeight = innerHeight / grid.rows;
  const muffinSize = Math.min(cellWidth, cellHeight) / 2 - 3;

  // Get color for a muffin dome at a given index
  const getMuffinColor = (index: number): string => {
    if (boxFlavors.length === 0) return '#E0E0E0';
    const flavor = boxFlavors[index % boxFlavors.length];
    return BOX_ITEM_COLORS[flavor] || '#E0E0E0';
  };

  // Generate muffin positions (center of each cell)
  const muffins = Array.from({ length: totalItems }, (_, i) => {
    const col = i % grid.cols;
    const row = Math.floor(i / grid.cols);
    const cx = boxX + padding + cellWidth * col + cellWidth / 2;
    const cy = boxY + padding + cellHeight * row + cellHeight / 2;
    return { cx, cy, index: i };
  });

  // Muffin cup (trapezoid) and dome dimensions relative to muffinSize
  const cupHeight = muffinSize * 0.6;
  const cupTopWidth = muffinSize * 0.8;
  const cupBottomWidth = muffinSize * 0.55;
  const domeHeight = muffinSize * 0.7;
  const domeWidth = muffinSize * 0.9;

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      role="img"
      aria-label={`Muffins preview: box of ${boxSize || 'none'}, ${boxFlavors.join(', ') || 'no flavors'}`}
    >
      {/* Box base */}
      <rect
        x={boxX}
        y={boxY}
        width={boxWidth}
        height={boxHeight}
        rx={6}
        fill={isEmpty ? 'none' : '#FFF8E1'}
        stroke={isEmpty ? '#BDBDBD' : '#D7CCC8'}
        strokeWidth={1.5}
        strokeDasharray={isEmpty ? '6 3' : 'none'}
      />

      {/* Box rim */}
      <rect
        x={boxX - 4}
        y={boxY - 8}
        width={boxWidth + 8}
        height={12}
        rx={3}
        fill={isEmpty ? 'none' : '#EFEBE9'}
        stroke={isEmpty ? '#BDBDBD' : '#D7CCC8'}
        strokeWidth={1.5}
        strokeDasharray={isEmpty ? '6 3' : 'none'}
      />

      {/* Muffins */}
      {muffins.map((muffin) => {
        const color = getMuffinColor(muffin.index);
        const hasFlavor = boxFlavors.length > 0;

        // Cup top-left, top-right, bottom-right, bottom-left (trapezoid)
        const cupTop = muffin.cy;
        const cupBottom = muffin.cy + cupHeight;
        const cupPath = [
          `M ${muffin.cx - cupTopWidth / 2} ${cupTop}`,
          `L ${muffin.cx + cupTopWidth / 2} ${cupTop}`,
          `L ${muffin.cx + cupBottomWidth / 2} ${cupBottom}`,
          `L ${muffin.cx - cupBottomWidth / 2} ${cupBottom}`,
          'Z',
        ].join(' ');

        return (
          <React.Fragment key={muffin.index}>
            {/* Muffin dome (rounded top) */}
            <ellipse
              cx={muffin.cx}
              cy={muffin.cy}
              rx={domeWidth}
              ry={domeHeight}
              fill={hasFlavor ? color : 'none'}
              stroke={hasFlavor ? '#A1887F' : '#BDBDBD'}
              strokeWidth={1}
              strokeDasharray={hasFlavor ? 'none' : '4 2'}
            />

            {/* Muffin cup (paper wrapper) */}
            <path
              d={cupPath}
              fill={hasFlavor ? '#D7CCC8' : 'none'}
              stroke={hasFlavor ? '#BCAAA4' : '#BDBDBD'}
              strokeWidth={1}
              strokeDasharray={hasFlavor ? 'none' : '4 2'}
            />
          </React.Fragment>
        );
      })}

      {/* Box label */}
      <text
        x={100}
        y={boxY + boxHeight + 25}
        textAnchor="middle"
        fontSize={11}
        fill="#9E9E9E"
        fontFamily="sans-serif"
      >
        {isEmpty ? 'Select box size' : `Box of ${boxSize}`}
      </text>
    </svg>
  );
}
