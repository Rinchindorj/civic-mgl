import { TopBar, BottomNav } from "@/components/Chrome";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <TopBar />
      <div className="pb-32">{children}</div>
      <BottomNav />
    </>
  );
}
