"use client";

import { Receipt } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Button, Card, Page } from "@/components/ui";

export default function EbarimtPage() {
  const { state, update, toast } = useAppState();
  const linked = state.ebarimtLinked;

  return (
    <Page title="E-Barimt холболт" fallback="/profile/info">
      <Card className="flex flex-col items-center p-6 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-orange-500/12 text-orange-500">
          <Receipt className="size-8" />
        </span>
        <p className="mt-4 text-[17px] font-bold text-ink">{linked ? "Таны E-Barimt данс холбогдсон байна" : "E-Barimt данс холбогдоогүй"}</p>
        <p className="mt-2 text-[14px] text-muted">
          Холбосноор худалдан авалтын баримтууд таны профайлд автоматаар бүртгэгдэнэ (демо).
        </p>
        {linked && (
          <dl className="mt-4 w-full space-y-2 rounded-2xl bg-soft p-4 text-left text-[14px]">
            <div className="flex justify-between"><dt className="text-muted">Энэ сарын баримт</dt><dd className="font-bold text-ink">23</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Нийт дүн</dt><dd className="font-bold text-ink">1,284,500₮</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Сугалааны эрх</dt><dd className="font-bold text-ink">23</dd></div>
          </dl>
        )}
      </Card>
      <Button
        variant={linked ? "danger" : "primary"}
        className="mt-5 h-14 w-full"
        onClick={() => {
          update("ebarimtLinked", !linked);
          toast(linked ? "Холболтыг саллаа" : "E-Barimt амжилттай холбогдлоо (демо)", "success");
        }}
      >
        {linked ? "Холболт салгах" : "Холбох"}
      </Button>
    </Page>
  );
}
