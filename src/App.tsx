import type {FunctionComponent} from "react";
import ScrollToTop from "@/layouts/ScrollToTop.tsx";
import {BrowserRouter} from "react-router";
import {AppGuard} from "@/components/shared/AppGuard.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AppRoutes} from "@/AppRoutes.tsx";

const queryClient = new QueryClient();

export const App: FunctionComponent = () => {
  return (
    <AppGuard>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors theme="light" />
      <ScrollToTop />
      <AppRoutes />
      </QueryClientProvider>
    </BrowserRouter>
    </AppGuard>
  )
}
