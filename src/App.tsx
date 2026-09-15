import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ToastProvider } from "@/components/ui";
import { DEFAULT_PATH, NAV } from "@/features/registry";

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to={DEFAULT_PATH} replace />} />
            {NAV.map((n) => {
              const C = n.component;
              return [n.path, ...(n.extraPaths ?? [])].map((p) => <Route key={p} path={p} element={<C />} />);
            })}
            <Route path="*" element={<Navigate to={DEFAULT_PATH} replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}
