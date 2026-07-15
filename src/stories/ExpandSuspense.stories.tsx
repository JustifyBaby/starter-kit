import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ExpandSuspense from "./ExpandSuspense"; // 実際の配置パスに合わせて調整してください
import { waitFor, within, expect } from "storybook/test";

const meta: Meta<typeof ExpandSuspense> = {
  title: "Components/ExpandSuspense",
  component: ExpandSuspense,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ExpandSuspense>;

// 💡 解決策: 一度生成したPromiseと結果をキャッシュするシンプルなデータフェッチャー
const promiseCache = new Map<
  string,
  { status: string; promise: Promise<void> }
>();

const useSuspenseCache = (key: string, delay: number) => {
  if (!promiseCache.has(key)) {
    const record = {
      status: "pending",
      promise: new Promise<void>((resolve) => setTimeout(resolve, delay)).then(
        () => {
          record.status = "fulfilled";
        },
      ),
    };
    promiseCache.set(key, record);
  }

  const current = promiseCache.get(key)!;
  if (current.status === "pending") {
    throw current.promise; // ローディング中のみPromiseをthrowする
  }
};

// 💡 1. 修正された非同期ダミーコンポーネント
const SlowComponent = ({
  message,
  delay,
  cacheKey,
}: {
  message: string;
  delay: number;
  cacheKey: string;
}) => {
  useSuspenseCache(cacheKey, delay);
  return <li>{message}</li>;
};

// 💡 3. ローディング表示用のスケルトン
const Skeleton = ({ label }: { label: string }) => (
  <li className="animate-pulse text-gray-400">⏳ {label}を読み込み中...</li>
);

export const Default: Story = {
  args: {
    components: [
      {
        content: (
          <SlowComponent
            message="コンテンツ A"
            delay={1500}
            cacheKey="test-a"
          />
        ),
        fallback: <Skeleton label="コンテンツ A" />,
      },
    ],
  },
  // 🔥 ここで「Suspenseの発動」と「解除」をテストする
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. 最初は「ローディング（fallback）」が表示されているか確認
    const loadingText = canvas.getByText("⏳ コンテンツ Aを読み込み中...");
    await expect(loadingText).toBeInTheDocument();

    // 2. 1.5秒の遅延（delay）が終わった後、ローディングが消えてコンテンツが出たか確認
    await waitFor(
      () => {
        // ローディングテキストが消えたことを期待する
        expect(
          canvas.queryByText("⏳ コンテンツ Aを読み込み中..."),
        ).not.toBeInTheDocument();
        // 本番コンテンツが表示されたことを確認
        expect(canvas.getByText("コンテンツ A")).toBeInTheDocument();
      },
      { timeout: 2000 }, // delay(1500ms)より少し長い時間を指定
    );
  },
};
