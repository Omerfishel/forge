// Test helper: render a feature page inside the router + toast provider with a
// fresh store. Usage: const { user } = renderPage(<LibraryPage />, { route: "/library" })
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { ToastProvider } from "@/components/ui";
import { defaultData, useForge } from "@/store";

export function resetStore(patch: Partial<ReturnType<typeof defaultData>> = {}) {
  useForge.setState({ ...defaultData(), ...patch });
}

export function renderPage(ui: ReactElement, opts: { route?: string; path?: string; extra?: ReactNode } = {}) {
  const route = opts.route ?? "/";
  const path = opts.path ?? route;
  const user = userEvent.setup();
  const utils = render(
    <ToastProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="*" element={<div data-testid="other-route" />} />
        </Routes>
        {opts.extra}
      </MemoryRouter>
    </ToastProvider>,
  );
  return { user, ...utils };
}
