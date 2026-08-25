import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// `globals: false` en vite.config.ts (ver ESTRUCTURA.md) evita que
// @testing-library/react enganche su auto-cleanup vía el `afterEach` global —
// se registra a mano acá para que cada test empiece con el DOM limpio.
afterEach(cleanup)
