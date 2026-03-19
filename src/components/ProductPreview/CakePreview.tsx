// SVG cake preview with two vertically stacked views:
// TopView: shape outline (circle or heart) with a centered measurement line and size label.
// SideView: stacked rectangular layers, directly touching, with optional filling stripes.

import React from 'react';
import {
  CAKE_FLAVOR_COLORS,
  CAKE_FILLING_COLORS,
  CAKE_SIZE_SCALES,
} from './previewConstants';

interface CakePreviewProps {
  config: {
    size?: string;
    layers?: number;
    flavor?: string;
    addons?: string[];
    text?: string;
    shape?: 'circle' | 'heart';
  };
}

// Simple heart path centered at (0, 0), fits roughly within a 60x60 box
const HEART_PATH = 'M 0,20 C -30,-5 -30,-30 0,-15 C 30,-30 30,-5 0,20 Z';

export default function CakePreview({ config }: CakePreviewProps) {
  const { size, layers = 1, flavor, addons = [], shape = 'circle' } = config;

  const scale = size ? (CAKE_SIZE_SCALES[size] || 0.75) : 0.7;
  const layerColor = flavor ? (CAKE_FLAVOR_COLORS[flavor] || '#E0E0E0') : '#E0E0E0';
  const fillingColor = flavor ? (CAKE_FILLING_COLORS[flavor] || '#F5F5F5') : '#F5F5F5';
  const isEmpty = !size && !flavor;
  const hasFilling = addons.includes('filling');
  const strokeStyle = isEmpty ? '#BDBDBD' : '#9E9E9E';

  // --- TopView geometry (upper half: y 0–90) ---
  const topCenterX = 100;
  const topCenterY = 45;
  const shapeRadius = 30 * scale;

  // Measurement line endpoints (horizontal diameter)
  const lineY = topCenterY + shapeRadius + 10;
  const lineLeft = topCenterX - shapeRadius;
  const lineRight = topCenterX + shapeRadius;

  // --- SideView geometry (lower half: y 100–200) ---
  const layerHeight = 20;
  const fillingHeight = 3;
  const sideWidth = 90 * scale;
  const sideX = 100 - sideWidth / 2;
  // Calculate total stack height to center it vertically in the lower half
  const totalFillings = hasFilling ? (layers - 1) * fillingHeight : 0;
  const totalStackHeight = layers * layerHeight + totalFillings;
  const sideStartY = 105 + (85 - totalStackHeight) / 2;

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      role="img"
      aria-label={`Cake preview: ${flavor || 'no flavor'}, ${size || 'no size'}, ${layers} layer${layers !== 1 ? 's' : ''}`}
    >
      {/* === TopView === */}
      {shape === 'circle' ? (
        <circle
          cx={topCenterX}
          cy={topCenterY}
          r={shapeRadius}
          fill={isEmpty ? 'none' : layerColor}
          stroke={strokeStyle}
          strokeWidth={1.5}
          strokeDasharray={isEmpty ? '6 3' : 'none'}
        />
      ) : (
        <g transform={`translate(${topCenterX}, ${topCenterY}) scale(${scale})`}>
          <path
            d={HEART_PATH}
            fill={isEmpty ? 'none' : layerColor}
            stroke={strokeStyle}
            strokeWidth={1.5}
            strokeDasharray={isEmpty ? '6 3' : 'none'}
          />
        </g>
      )}

      {/* Measurement line with size label */}
      {size && (
        <>
          <line x1={lineLeft} y1={lineY} x2={lineRight} y2={lineY} stroke="#757575" strokeWidth={1} />
          <line x1={lineLeft} y1={lineY - 3} x2={lineLeft} y2={lineY + 3} stroke="#757575" strokeWidth={1} />
          <line x1={lineRight} y1={lineY - 3} x2={lineRight} y2={lineY + 3} stroke="#757575" strokeWidth={1} />
          <text
            x={topCenterX}
            y={lineY + 12}
            textAnchor="middle"
            fontSize={10}
            fill="#757575"
            fontFamily="sans-serif"
          >
            {size === 'Bento' ? 'Bento' : `${size}"`}
          </text>
        </>
      )}

      {/* Divider between views */}
      <line x1={30} y1={97} x2={170} y2={97} stroke="#E0E0E0" strokeWidth={0.5} />

      {/* === SideView: stacked layers, bottom-to-top === */}
      {Array.from({ length: layers }, (_, i) => {
        // i=0 is bottom layer, i=layers-1 is top layer. Draw from bottom up.
        const yOffset = sideStartY + i * layerHeight + (hasFilling ? i * fillingHeight : 0);

        return (
          <React.Fragment key={i}>
            {/* Filling stripe above this layer (except the topmost) */}
            {hasFilling && i > 0 && (
              <rect
                x={sideX}
                y={yOffset - fillingHeight}
                width={sideWidth}
                height={fillingHeight}
                fill={isEmpty ? 'none' : fillingColor}
                stroke={isEmpty ? '#BDBDBD' : 'none'}
                strokeWidth={isEmpty ? 0.5 : 0}
              />
            )}

            {/* Layer rectangle */}
            <rect
              x={sideX}
              y={yOffset}
              width={sideWidth}
              height={layerHeight}
              fill={isEmpty ? 'none' : layerColor}
              stroke={strokeStyle}
              strokeWidth={1}
              strokeDasharray={isEmpty ? '6 3' : 'none'}
            />
          </React.Fragment>
        );
      })}

      {/* Side view label */}
      {layers > 1 && !isEmpty && (
        <text
          x={100}
          y={sideStartY + totalStackHeight + 14}
          textAnchor="middle"
          fontSize={9}
          fill="#9E9E9E"
          fontFamily="sans-serif"
        >
          {layers} layers
        </text>
      )}

      {/* Empty state label */}
      {isEmpty && (
        <text x={100} y={150} textAnchor="middle" fontSize={11} fill="#9E9E9E" fontFamily="sans-serif">
          Configure your cake
        </text>
      )}
    </svg>
  );
}
