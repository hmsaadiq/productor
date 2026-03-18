// SVG renderer for cookies product preview.
// Shows an open box with cookie circles arranged in a grid based on boxSize and boxFlavors.

import React from 'react';
import { BOX_ITEM_COLORS } from './previewConstants';

interface CookiesPreviewProps {
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

export default function CookiesPreview({ config }: CookiesPreviewProps) {
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

  // Cookie layout inside the box
  const padding = 12;
  const innerWidth = boxWidth - padding * 2;
  const innerHeight = boxHeight - padding * 2;
  const cellWidth = innerWidth / grid.cols;
  const cellHeight = innerHeight / grid.rows;
  const cookieRadius = Math.min(cellWidth, cellHeight) / 2 - 3;

  // Get color for a cookie at a given index
  const getCookieColor = (index: number): string => {
    if (boxFlavors.length === 0) return '#E0E0E0';
    // Alternate between selected flavors
    const flavor = boxFlavors[index % boxFlavors.length];
    return BOX_ITEM_COLORS[flavor] || '#E0E0E0';
  };

  // Generate cookie positions
  const cookies = Array.from({ length: totalItems }, (_, i) => {
    const col = i % grid.cols;
    const row = Math.floor(i / grid.cols);
    const cx = boxX + padding + cellWidth * col + cellWidth / 2;
    const cy = boxY + padding + cellHeight * row + cellHeight / 2;
    return { cx, cy, index: i };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      role="img"
      aria-label={`Cookies preview: box of ${boxSize || 'none'}, ${boxFlavors.join(', ') || 'no flavors'}`}
    >
      {/* Box base (bottom face) */}
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

      {/* Box rim (top edge) */}
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

      {/* Cookies */}
      {cookies.map((cookie) => {
        const color = getCookieColor(cookie.index);
        const hasFlavor = boxFlavors.length > 0;

        return (
          <React.Fragment key={cookie.index}>
            {/* Cookie circle */}
            <circle
              cx={cookie.cx}
              cy={cookie.cy}
              r={cookieRadius}
              fill={hasFlavor ? color : 'none'}
              stroke={hasFlavor ? '#A1887F' : '#BDBDBD'}
              strokeWidth={1}
              strokeDasharray={hasFlavor ? 'none' : '4 2'}
            />

            {/* Chocolate chip dots (for chocolate chip flavor) */}
            {hasFlavor && boxFlavors[cookie.index % boxFlavors.length] === 'chocolate chip' && (
              <>
                <circle cx={cookie.cx - 4} cy={cookie.cy - 3} r={1.5} fill="#5D4037" />
                <circle cx={cookie.cx + 3} cy={cookie.cy + 2} r={1.5} fill="#5D4037" />
                <circle cx={cookie.cx + 1} cy={cookie.cy - 5} r={1.5} fill="#5D4037" />
                <circle cx={cookie.cx - 2} cy={cookie.cy + 4} r={1.5} fill="#5D4037" />
              </>
            )}
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
