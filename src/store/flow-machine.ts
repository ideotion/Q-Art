/**
 * Guided-flow state machine (XState v5) — drives navigation for all three GUIs:
 * Atlas walks the 7 boards, Cartes flips the deck, Socrate walks the deterministic
 * question-tree. It owns *where you are*; the decision data lives in the Zustand
 * store, so switching GUIs never loses an answer.
 */
import { assign, setup } from "xstate";
import { BOARDS, CARTES_DECK, SOCRATE_TREE, type Mode } from "../lib/qart";

export interface FlowContext {
  mode: Mode | null;
  nodeId: string | null; // socrate: current question-tree node
  boardIndex: number; // atlas: current board
  cardIndex: number; // cartes: current deck card
}

export type FlowEvent =
  | { type: "START"; mode: Mode }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO_BOARD"; index: number }
  | { type: "GOTO_CARD"; index: number }
  | { type: "GOTO_NODE"; id: string }
  | { type: "FINISH" }
  | { type: "RESET" };

const order = SOCRATE_TREE.order;
const lastBoard = BOARDS.length - 1;
const lastCard = CARTES_DECK.length - 1;
const clamp = (i: number, max: number) => Math.max(0, Math.min(i, max));

function nextNode(id: string | null): string | null {
  if (!id) return null;
  return SOCRATE_TREE.nodes[id]?.next ?? id;
}
function prevNode(id: string | null): string | null {
  if (!id) return null;
  const i = order.indexOf(id);
  return i > 0 ? order[i - 1] : id;
}

export const flowMachine = setup({
  types: {
    context: {} as FlowContext,
    events: {} as FlowEvent,
  },
  actions: {
    begin: assign(({ event }) => {
      if (event.type !== "START") return {};
      return {
        mode: event.mode,
        boardIndex: 0,
        cardIndex: 0,
        nodeId: event.mode === "socrate" ? SOCRATE_TREE.rootId : null,
      };
    }),
    advance: assign(({ context }) => {
      if (context.mode === "socrate") return { nodeId: nextNode(context.nodeId) };
      if (context.mode === "cartes") return { cardIndex: clamp(context.cardIndex + 1, lastCard) };
      return { boardIndex: clamp(context.boardIndex + 1, lastBoard) };
    }),
    back: assign(({ context }) => {
      if (context.mode === "socrate") return { nodeId: prevNode(context.nodeId) };
      if (context.mode === "cartes") return { cardIndex: clamp(context.cardIndex - 1, lastCard) };
      return { boardIndex: clamp(context.boardIndex - 1, lastBoard) };
    }),
    gotoBoard: assign(({ event }) =>
      event.type === "GOTO_BOARD" ? { boardIndex: clamp(event.index, lastBoard) } : {},
    ),
    gotoCard: assign(({ event }) =>
      event.type === "GOTO_CARD" ? { cardIndex: clamp(event.index, lastCard) } : {},
    ),
    gotoNode: assign(({ event }) =>
      event.type === "GOTO_NODE" && SOCRATE_TREE.nodes[event.id] ? { nodeId: event.id } : {},
    ),
    clear: assign(() => ({ mode: null, nodeId: null, boardIndex: 0, cardIndex: 0 })),
  },
}).createMachine({
  id: "flow",
  initial: "idle",
  context: { mode: null, nodeId: null, boardIndex: 0, cardIndex: 0 },
  states: {
    idle: {
      on: { START: { target: "running", actions: "begin" } },
    },
    running: {
      on: {
        NEXT: { actions: "advance" },
        PREV: { actions: "back" },
        GOTO_BOARD: { actions: "gotoBoard" },
        GOTO_CARD: { actions: "gotoCard" },
        GOTO_NODE: { actions: "gotoNode" },
        FINISH: { target: "done" },
        RESET: { target: "idle", actions: "clear" },
      },
    },
    done: {
      on: { RESET: { target: "idle", actions: "clear" } },
    },
  },
});
