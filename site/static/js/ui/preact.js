let preact, preactHooks, htm

if (typeof window !== 'undefined') {
  preact = await import('https://esm.sh/preact@10.20.1')
  preactHooks = await import('https://esm.sh/preact@10.20.1/hooks')
  const htmModule = await import('https://esm.sh/htm@3.1.1')
  htm = htmModule.default || htmModule
} else {
  preact = await import('preact')
  preactHooks = await import('preact/hooks')
  const htmModule = await import('htm')
  htm = htmModule.default || htmModule
}

export const { h, render, Component, createContext } = preact
export const { useState, useEffect, useRef, useMemo, useCallback, useReducer } = preactHooks
export const html = htm.bind(preact.h)
