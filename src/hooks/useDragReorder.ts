import { useState, useRef } from 'react';

/**
 * useDragReorder
 * ---------------------------------------------------------------
 * Wires native HTML5 DnD events with a custom animated ghost so
 * dragged cards look like they are physically "carried":
 *
 *  • The ghost is a styled clone: slightly rotated, scaled up,
 *    with a deep multi-layer shadow — giving a "lifted card" feel.
 *  • The original slot becomes a faint dashed placeholder.
 *  • The drop-target slot shows an indigo highlight ring.
 *
 * No extra npm packages required.
 *
 * Usage:
 *   const { dragIndex, overIndex, getDragHandleProps, getItemProps }
 *     = useDragReorder(onReorder);
 *
 *   Spread getItemProps(index)     on the outer draggable wrapper.
 *   Spread getDragHandleProps(index) on the grip-icon element.
 */
export function useDragReorder(
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);

  const getDragHandleProps = (index: number) => ({
    draggable: true as const,

    onDragStart: (e: React.DragEvent<HTMLElement>) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      // Required for Firefox
      e.dataTransfer.setData('text/plain', String(index));

      // ── Custom ghost image ────────────────────────────────────
      // Walk up to the card container (the element that has the
      // border / shadow / rounded-2xl styles)
      const handle = e.currentTarget;
      const card = handle.closest('[data-drag-card]') as HTMLElement | null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const ghost = card.cloneNode(true) as HTMLElement;

      // Position off-screen so it doesn't flash visibly
      Object.assign(ghost.style, {
        position:     'fixed',
        top:          '-9999px',
        left:         '-9999px',
        width:        `${rect.width}px`,
        // "Carried card" transform: slight clockwise tilt + tiny scale up
        transform:    'rotate(2.5deg) scale(1.04)',
        transformOrigin: 'top left',
        boxShadow:    '0 24px 64px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        opacity:      '0.96',
        pointerEvents:'none',
        // Keep the card's background visible, no dimming
        background:   'white',
        zIndex:       '9999',
      });

      document.body.appendChild(ghost);
      ghostRef.current = ghost;

      // Offset the ghost so cursor lands roughly in the centre-top
      e.dataTransfer.setDragImage(ghost, rect.width / 2, 28);
    },

    onDragEnd: () => {
      // Clean up ghost
      if (ghostRef.current) {
        document.body.removeChild(ghostRef.current);
        ghostRef.current = null;
      }
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  const getItemProps = (index: number) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overIndex !== index) setOverIndex(index);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragIndex !== null && dragIndex !== index) {
        onReorder(dragIndex, index);
      }
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  return { dragIndex, overIndex, getDragHandleProps, getItemProps };
}
