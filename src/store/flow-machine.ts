/**
 * Guided-flow state machine (XState v5) — drives navigation for both doors:
 * Atlas walks the 7 boards; Socrate walks the deterministic question-tree.
 * It owns *where you are*; the decision data lives in the Zustand store.
 */
import { assign, setup } from "xstate";
import { BOARDS, SOCRATE_TREE, type Mode } from "../lib/qart";

export interface FlowContext {
  mode: Mode | null;
  nodeId: string | null; // socrate: current question-tree node
  boardIndex: number; // atlas: current board
}

export type FlowEvent =
  | { type: "START"; mode: Mode }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO_BOARD"; index: number }
  | { type: "GOTO_NODE"; id: string }
  | { type: "FINISH" }
  | { type: "RESET" };

const order = SOCRATE_TREE.order;
const lastBoard = BOARDS.length - 1;
const clampBoard = (i: number) => Math.max(0, Math.min(i, lastBoard));

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
        nodeId: event.mode === "socrate" ? SOCRATE_TREE.rootId : null,
      };
    }),
    advance: assign(({ context }) =>
      context.mode === "socrate"
        ? { nodeId: nextNode(context.nodeId) }
        : { boardIndex: clampBoard(context.boardIndex + 1) },
    ),
    back: assign(({ context }) =>
      context.mode === "socrate"
        ? { nodeId: prevNode(context.nodeId) }
        : { boardIndex: clampBoard(context.boardIndex - 1) },
    ),
    gotoBoard: assign(({ event }) =>
      event.type === "GOTO_BOARD" ? { boardIndex: clampBoard(event.index) } : {},
    ),
    gotoNode: assign(({ event }) =>
      event.type === "GOTO_NODE" && SOCRATE_TREE.nodes[event.id] ? { nodeId: event.id } : {},
    ),
    clear: assign(() => ({ mode: null, nodeId: null, boardIndex: 0 })),
  },
}).createMachine({
  id: "flow",
  initial: "idle",
  context: { mode: null, nodeId: null, boardIndex: 0 },
  states: {
    idle: {
      on: { START: { target: "running", actions: "begin" } },
    },
    running: {
      on: {
        NEXT: { actions: "advance" },
        PREV: { actions: "back" },
        GOTO_BOARD: { actions: "gotoBoard" },
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
