/**
 * Event-code catalog (seed — grows with the app). Codes are content-free.
 * Mirror of docs/diagnostics.md §event-code catalog.
 */
export const EV = {
  APP_BOOT: "app.boot",
  APP_READY: "app.ready",
  APP_ERROR: "app.error",
  NAV_ROUTE: "nav.route",
  ATLAS_CASE_CREATE: "atlas.case.create",
  ATLAS_BOARD_OPEN: "atlas.board.open",
  ATLAS_ITEM_CHECK: "atlas.item.check",
  ATLAS_WEIGHT_SET: "atlas.weight.set",
  ATLAS_SYNTHESIS_RUN: "atlas.synthesis.run",
  ATLAS_EXPORT: "atlas.export",
  SOCRATE_SESSION_START: "socrate.session.start",
  SOCRATE_TURN_SEND: "socrate.turn.send",
  SOCRATE_TURN_RECV: "socrate.turn.recv",
  SOCRATE_MAP_WRITE: "socrate.map.write",
  SOCRATE_DEGRADED: "socrate.degraded",
  CARTES_SESSION_START: "cartes.session.start",
  CARTES_CARD_OPEN: "cartes.card.open",
  CARTES_CARD_KEEP: "cartes.card.keep",
  CARTES_CARD_SKIP: "cartes.card.skip",
  GUI_SELECT: "gui.select",
  WEIGHT_METHOD_SET: "weight.method.set",
  STORE_TX: "store.tx",
  STORE_MIGRATE: "store.migrate",
  STORAGE_PERSIST_GRANTED: "storage.persist.granted",
  STORAGE_PERSIST_DENIED: "storage.persist.denied",
  STORAGE_EVICTED: "storage.evicted",
  I18N_LOCALE_LOAD: "i18n.locale.load",
  I18N_MISSING_KEY: "i18n.missingKey",
  PWA_INSTALL: "pwa.install",
  PWA_SW_UPDATE: "pwa.sw.update",
  DIAG_EXPORT: "diag.export",
  DIAG_DEEPMODE_ON: "diag.deepmode.on",
  DIAG_DEEPMODE_OFF: "diag.deepmode.off",
} as const;

export type EventCode = (typeof EV)[keyof typeof EV];
