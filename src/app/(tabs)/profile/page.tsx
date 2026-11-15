"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, ChevronDown, ChevronRight } from "lucide-react";
import { AdminTileArt } from "@/components/Art";
import { PROFILE_ICONS as I } from "@/lib/icons";
import { useAppState, displayName } from "@/context/AppStateContext";
import { ConfirmDialog, MenuGroup, MenuRow, useTransient } from "@/components/ui";
import { Avatar } from "@/components/Sample";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { state, logout } = useAppState();
  const u = state.sampleUser;
  const [expand, setExpand] = useState(false);
  const [confirm, setConfirm] = useTransient(false);
  const unreadMail = state.mail.filter((m) => !m.read && !m.sent).length;
  const count = state.history.length;

  return (
    <div className="space-y-3.5 px-4 pt-1">
      <div className="overflow-hidden rounded-card bg-card shadow-sm">
        <Link href="/profile/info" className="flex items-center gap-3 p-4">
          <span className="relative">
            <Avatar user={u} />
            <BadgeCheck className="absolute -right-1 -bottom-1 size-6 rounded-full bg-card fill-violet-400 text-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[18px] font-bold text-brand">{displayName(u)}</span>
            <span className="block truncate text-[14px] text-ink">{u.email}</span>
          </span>
          <ChevronRight className="size-5 text-muted" />
        </Link>
        <div className="border-t border-line px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-[15px] leading-snug text-ink">
              Та нийт <b className="text-brand">{count}</b> үйлчилгээ авч дараах хэмнэлтийг хийсэн байна.
            </p>
            <button
              type="button"
              aria-expanded={expand}
              aria-label="Дэлгэрэнгүй"
              onClick={() => setExpand((v) => !v)}
              className="grid size-11 place-items-center rounded-full bg-card text-brand shadow ring-1 ring-line"
            >
              <ChevronDown className={cn("size-5 transition", expand && "rotate-180")} />
            </button>
          </div>
          {expand && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                [`${count * 45} мин`, "Цаг хэмнэсэн"],
                [`${(count * 3500).toLocaleString()}₮`, "Зардал хэмнэсэн"],
                [`${count * 2}`, "Цаас хэмнэсэн"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-soft p-2.5">
                  <p className="text-[16px] font-extrabold text-brand">{v}</p>
                  <p className="text-[11.5px] text-muted">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MenuGroup>
        <MenuRow image={I.documents} title="Миний бичиг баримт" href="/profile/documents" />
      </MenuGroup>
      <MenuGroup>
        <MenuRow image={I.stateData} title="Төрд байгаа миний мэдээлэл" href="/profile/state-data" />
        <MenuRow image={I.wallet} title="Цахим хэтэвч" href="/profile/wallet" />
      </MenuGroup>
      <MenuGroup>
        <MenuRow image={I.history} title="Үйлчилгээний түүх" href="/profile/history" />
      </MenuGroup>
      <MenuGroup>
        <MenuRow
          image={I.mail}
          title="Үндэсний шуудан"
          href="/profile/mail"
          badge={unreadMail ? <span className="rounded-full bg-red-500 px-2 text-[12px] font-bold text-white">{unreadMail}</span> : undefined}
        />
        <MenuRow image={I.gratitude} title="Талархал" href="/profile/gratitude" />
        <MenuRow image={I.polls} title="Санал асуулга" href="/profile/polls" />
        <MenuRow image={I.petitions} title="Өргөдөл, гомдол" href="/profile/petitions" />
        <MenuRow image={I.verification} title="Баталгаажуулалт" href="/profile/verification" />
      </MenuGroup>
      <MenuGroup>
        <MenuRow
          art={<AdminTileArt className="size-12" />}
          title="Админ хэсэг (Загвар & Бүтэц)"
          href="/admin"
          badge={<span className="rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-black text-white">ADMIN</span>}
        />
      </MenuGroup>
      <MenuGroup>
        <MenuRow image={I.logout} title="Системээс гарах" trailing="none" onClick={() => setConfirm(true)} />
      </MenuGroup>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Системээс гарах уу?"
        message="Демо сессээс гарч, нэвтрэх хуудас руу шилжинэ."
        confirmLabel="Гарах"
        danger
        onConfirm={logout}
      />
    </div>
  );
}
