import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { BOARDS, CARTES_DECK, SOCRATE_TREE } from "../lib/qart";
import { flowMachine } from "./flow-machine";

const start = () => createActor(flowMachine).start();

describe("flow machine", () => {
  it("starts Socrate at the question-tree root and walks nodes both ways", () => {
    const a = start();
    a.send({ type: "START", mode: "socrate" });
    expect(a.getSnapshot().value).toBe("running");
    expect(a.getSnapshot().context.nodeId).toBe(SOCRATE_TREE.rootId);

    a.send({ type: "NEXT" });
    expect(a.getSnapshot().context.nodeId).toBe(SOCRATE_TREE.nodes[SOCRATE_TREE.rootId].next);

    a.send({ type: "PREV" });
    expect(a.getSnapshot().context.nodeId).toBe(SOCRATE_TREE.rootId);
  });

  it("walks Atlas boards and clamps at both ends", () => {
    const a = start();
    a.send({ type: "START", mode: "atlas" });
    expect(a.getSnapshot().context.boardIndex).toBe(0);

    a.send({ type: "PREV" });
    expect(a.getSnapshot().context.boardIndex).toBe(0); // clamped low

    for (let i = 0; i < BOARDS.length + 3; i++) a.send({ type: "NEXT" });
    expect(a.getSnapshot().context.boardIndex).toBe(BOARDS.length - 1); // clamped high
  });

  it("flips the Cartes deck and clamps at both ends", () => {
    const a = start();
    a.send({ type: "START", mode: "cartes" });
    expect(a.getSnapshot().context.cardIndex).toBe(0);

    a.send({ type: "PREV" });
    expect(a.getSnapshot().context.cardIndex).toBe(0); // clamped low

    for (let i = 0; i < CARTES_DECK.length + 3; i++) a.send({ type: "NEXT" });
    expect(a.getSnapshot().context.cardIndex).toBe(CARTES_DECK.length - 1); // clamped high

    a.send({ type: "GOTO_CARD", index: 2 });
    expect(a.getSnapshot().context.cardIndex).toBe(2);
  });

  it("finishes and resets", () => {
    const a = start();
    a.send({ type: "START", mode: "atlas" });
    a.send({ type: "FINISH" });
    expect(a.getSnapshot().value).toBe("done");

    a.send({ type: "RESET" });
    expect(a.getSnapshot().value).toBe("idle");
    expect(a.getSnapshot().context.mode).toBeNull();
  });
});
