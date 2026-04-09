import { beforeAll, afterEach, afterAll } from "vitest"
import { worker } from "@/mocks/browser"
import {cleanup} from "vitest-browser-react";

const isQuiet = import.meta.env.MSW_QUIET === "1";

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