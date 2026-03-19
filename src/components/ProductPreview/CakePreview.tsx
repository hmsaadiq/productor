// SVG cake preview with two vertically stacked views:
// TopView: shape outline (circle or heart) with a centered measurement line and size label.
// SideView: stacked rectangular layers with per-layer flavor colors, filling stripe, and flavor legend below.

import React from 'react';
import {
  CAKE_FLAVOR_COLORS,
  CAKE_FLAVOR_TEXT_COLORS,
  FILLING_COLORS,
  CAKE_SIZE_SCALES,
} from './previewConstants';

interface CakePreviewProps {
  config: {
    size?: string;
    layers?: number;
    flavors?: string[];
    filling?: string;
    addons?: string[];
    text?: string;
    shape?: 'circle' | 'heart';
  };
}

const HEART_PATH = 'M 0,20 C -30,-5 -30,-30 0,-15 C 30,-30 30,-5 0,20 Z';
const DEFAULT_LAYER_COLOR = '#E0E0E0';
const FALLBACK_FILLING_COLOR = '#D4C5B0';

export default function CakePreview({ config }: CakePreviewProps) {
  const { size, layers = 1, flavors = [], shape = 'circle' } = config;
  const filling = config.filling;

  const scale = size ? (CAKE_SIZE_SCALES[size] || 0.75) : 0.7;
  const isEmpty = !size && flavors.length === 0;
  const strokeStyle = isEmpty ? '#BDBDBD' : '#9E9E9E';
  const hasFilling = !!filling && layers >= 2;

  // Per-layer color helpers
  const layerColor = (i: number) => {
    const f = flavors[i];
    return f ? (CAKE_FLAVOR_COLORS[f] || DEFAULT_LAYER_COLOR) : DEFAULT_LAYER_COLOR;
  };
  const layerTextColor = (i: number) => {
    const f = flavors[i];
    return f ? (CAKE_FLAVOR_TEXT_COLORS[f] || '#555555') : '#888888';
  };
  const fillingColor = filling
    ? (FILLING_COLORS[filling] || FALLBACK_FILLING_COLOR)
    : FALLBACK_FILLING_COLOR;

  // Top view uses the topmost layer's color (layer index 0 = top visually)
  const topLayerColor = layerColor(0);

  // --- TopView geometry (upper half: y 0–90) ---
  const topCenterX = 100;
  const topCenterY = 42;
  const shapeRadius = 28 * scale;
  const lineY = topCenterY + shapeRadius + 8;
  const lineLeft = topCenterX - shapeRadius;
  const lineRight = topCenterX + shapeRadius;

  // --- SideView geometry (middle: y 97–180) ---
  const layerHeight = 18;
  const fillingHeight = 4;
  const sideWidth = 86 * scale;
  const sideX = 100 - sideWidth / 2;
  const totalFillings = hasFilling ? (layers - 1) * fillingHeight : 0;
  const totalStackHeight = layers * layerHeight + totalFillings;
  // Center stack in the band y=100..182
  const sideStartY = 100 + (82 - totalStackHeight) / 2;

  // --- Legend geometry (below side view: y ~185–250) ---
  // Each flavor label rendered as a colored pill
  const legendStartY = 188;
  const legendItemHeight = 13;

  // Build legend entries: [layerIndex, flavorName]
  const legendEntries: Array<{ label: string; color: string; textColor: string }> = [];
  for (let i = 0; i < layers; i++) {
    const f = flavors[i];
    legendEntries.push({
      label: f ? `L${i + 1}: ${f}` : `L${i + 1}: —`,
      color: layerColor(i),
      textColor: layerTextColor(i),
    });
  }
  if (hasFilling && filling) {
    legendEntries.push({
      label: `Fill: ${filling}`,
      color: fillingColor,
      textColor: '#ffffff',
    });
  }

  const viewBoxHeight = legendStartY + legendEntries.length * legendItemHeight + 8;

  return (
    <svg
      viewBox={`0 0 200 ${viewBoxHeight}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={`Cake preview: ${flavors.join(', ') || 'no flavor'}, ${size || 'no size'}, ${layers} layer${layers !== 1 ? 's' : ''}`}
    >
      {/* === TopView === */}
      {shape === 'circle' ? (
        <circle
          cx={topCenterX}
          cy={topCenterY}
          r={shapeRadius}
          fill={isEmpty ? 'none' : topLayerColor}
          stroke={strokeStyle}
          strokeWidth={1.5}
          strokeDasharray={isEmpty ? '6 3' : 'none'}
        />
      ) : (
        <g transform={`translate(${topCenterX}, ${topCenterY}) scale(${scale})`}>
          <path
            d={HEART_PATH}
            fill={isEmpty ? 'none' : topLayerColor}
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
          <text x={topCenterX} y={lineY + 11} textAnchor="middle" fontSize={9} fill="#757575" fontFamily="sans-serif">
            {size === 'Bento' ? 'Bento' : `${size}"`}
          </text>
        </>
      )}

      {/* Divider between views */}
      <line x1={20} y1={96} x2={180} y2={96} stroke="#E0E0E0" strokeWidth={0.5} />

      {/* === SideView: stacked layers, top-to-bottom (i=0 = top layer visually) === */}
      {Array.from({ length: layers }, (_, i) => {
        const yOffset = sideStartY + i * layerHeight + (hasFilling ? i * fillingHeight : 0);
        const lColor = layerColor(i);

        return (
          <React.Fragment key={i}>
            {/* Filling stripe between layers */}
            {hasFilling && i > 0 && (
              <rect
                x={sideX}
                y={yOffset - fillingHeight}
                width={sideWidth}
                height={fillingHeight}
                fill={fillingColor}
                rx={1}
              />
            )}

            {/* Layer rectangle */}
            <rect
              x={sideX}
              y={yOffset}
              width={sideWidth}
              height={layerHeight}
              fill={isEmpty ? 'none' : lColor}
              stroke={strokeStyle}
              strokeWidth={1}
              strokeDasharray={isEmpty ? '6 3' : 'none'}
              rx={1}
            />
          </React.Fragment>
        );
      })}

      {/* Empty state */}
      {isEmpty && (
        <text x={100} y={148} textAnchor="middle" fontSize={11} fill="#9E9E9E" fontFamily="sans-serif">
          Configure your cake
        </text>
      )}

      {/* Divider before legend */}
      {!isEmpty && legendEntries.length > 0 && (
        <line x1={20} y1={183} x2={180} y2={183} stroke="#E0E0E0" strokeWidth={0.5} />
      )}

      {/* === Legend: colored pills with flavor/filling labels === */}
      {!isEmpty && legendEntries.map((entry, idx) => {
        const pillY = legendStartY + idx * legendItemHeight;
        const pillW = 160;
        const pillH = legendItemHeight - 2;
        const pillX = (200 - pillW) / 2;

        return (
          <g key={idx}>
            <rect
              x={pillX}
              y={pillY}
              width={pillW}
              height={pillH}
              rx={pillH / 2}
              fill={entry.color}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={0.5}
            />
            <text
              x={100}
              y={pillY + pillH / 2 + 3.5}
              textAnchor="middle"
              fontSize={8}
              fontFamily="sans-serif"
              fontWeight="600"
              fill={entry.textColor}
            >
              {entry.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
