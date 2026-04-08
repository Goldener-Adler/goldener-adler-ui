import {handlers} from "@/mocks/handlers.ts";
import {setupServer} from "msw/node";
// for mocking api endpoints in tests
export const server = setupServer(...handlers);