import { useState, useRef, useCallback } from 'react';

/**
 * useDragReorder (v3 — pointer events)
 * ---------------------------------------------------------------
 * Replaces HTML5 DnD (which is unreliable for custom animated drags)
 * with raw pointer events so we have complete control:
 *
 *  - A ghost clone spawns at the card's position and FOLLOWS the cursor.
 *  - The original slot becomes a dashed breathing placeholder.
 *  - The hovered slot glows with a pulsing indigo ring.
 *  - Works on mouse AND touch / stylus (pointer events are unified).
 *
 * Usage in each tab:
 *   const { dragIndex, overIndex, getGripProps, getCardRef } = useDragReorder(onReorder);
 *
 *   <div ref={getCardRef(index)} ...>          ← card container
 *     <div {...getGripProps(index)} ...>        ← grip handle
 */
export function useDragReorder(
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Mutable refs so closures inside window listeners always see fresh values
  const stateRef  = useRef<{ drag: number | null; over: number | null }>({ drag: null, over: null });
  const ghostRef  = useRef<HTMLElement | null>(null);
  const cardRefs  = useRef<(HTMLElement | null)[]>([]);

  /** Callback ref to register each card element */
  const getCardRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  /** Props for the grip handle element */
  const getGripProps = (index: number) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      // Only trigger on primary button / touch
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      const card = cardRefs.current[index];
      if (!card) return;

      const rect     = card.getBoundingClientRect();
      const offsetX  = e.clientX - rect.left;
      const offsetY  = e.clientY - rect.top;

      // ── Spawn floating ghost ──────────────────────────────────
      const ghost = card.cloneNode(true) as HTMLElement;
      Object.assign(ghost.style, {
        position:   'fixed',
        top:        `${rect.top}px`,
        left:       `${rect.left}px`,
        width:      `${rect.width}px`,
        margin:     '0',
        zIndex:     '9999',
        transform:  'rotate(2.5deg) scale(1.05)',
        boxShadow:  '0 28px 72px rgba(0,0,0,0.24), 0 10px 24px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        pointerEvents: 'none',
        opacity:    '0.97',
        background: 'white',
        transition: 'none',
      });
      document.body.appendChild(ghost);
      ghostRef.current = ghost;

      // ── Update state ──────────────────────────────────────────
      stateRef.current.drag = index;
      stateRef.current.over = null;
      setDragIndex(index);
      setOverIndex(null);

      // ── Pointer move — move ghost + detect drop target ────────
      const onMove = (ev: PointerEvent) => {
        if (!ghostRef.current) return;

        // Move ghost with cursor
        ghostRef.current.style.top  = `${ev.clientY - offsetY}px`;
        ghostRef.current.style.left = `${ev.clientX - offsetX}px`;

        // Find which card the cursor's centre is inside
        const midY = ev.clientY;
        let newOver: number | null = null;
        cardRefs.current.forEach((el, i) => {
          if (!el || i === stateRef.current.drag) return;
          const r = el.getBoundingClientRect();
          if (midY >= r.top && midY <= r.bottom) newOver = i;
        });

        if (newOver !== stateRef.current.over) {
          stateRef.current.over = newOver;
          setOverIndex(newOver);
        }
      };

      // ── Pointer up — commit reorder and clean up ──────────────
      const onUp = () => {
        const from = stateRef.current.drag;
        const to   = stateRef.current.over;

        // Remove ghost
        if (ghostRef.current && document.body.contains(ghostRef.current)) {
          document.body.removeChild(ghostRef.current);
          ghostRef.current = null;
        }

        stateRef.current.drag = null;
        stateRef.current.over = null;
        setDragIndex(null);
        setOverIndex(null);

        if (from !== null && to !== null && from !== to) {
          onReorder(from, to);
        }

        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup',   onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup',   onUp, { once: true });
    },

    style: { cursor: 'grab', touchAction: 'none' } as React.CSSProperties,
  });

  return { dragIndex, overIndex, getGripProps, getCardRef };
}
