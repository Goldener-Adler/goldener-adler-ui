import { beforeAll, afterEach, afterAll } from "vitest"
import { worker } from "@/mocks/browser"
import {cleanup} from "vitest-browser-react";
import { vi } from "vitest"

const isQuiet = import.meta.env.MSW_QUIET === "1";

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn(),
  },
}))

beforeAll(async () => {
  await worker.start({
    quiet: isQuiet,
    onUnhandledRequest: isQuiet ? 'bypass' : 'error',
  })
})

afterEach(() => {
  worker.resetHandlers();
  cleanup();
})

afterAll(() => {
  worker.stop()
})