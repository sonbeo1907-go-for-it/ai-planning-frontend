import type { Metadata } from "next";

import { ComponentTestPage } from "./ComponentTestPage";

export const metadata: Metadata = {
  title: "Component Test",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ComponentTestPage />;
}
