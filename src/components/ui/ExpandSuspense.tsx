/**
@description:
  Suspenceさせたいコンポーネントを配列で受け取り、
  それとfallbackを受け取ると、
  Suspenseが展開される。
 */

import { ReactNode, Suspense } from "react";

type Child = {
  content: ReactNode;
  fallback: ReactNode;
};

type ExpandSuspenseProps = {
  components: Child[];
};

export default function ExpandSuspense({ components }: ExpandSuspenseProps) {
  return (
    <ul>
      {components.map((c, i) => (
        <Suspense key={i} fallback={c.fallback}>
          {c.content}
        </Suspense>
      ))}
    </ul>
  );
}
