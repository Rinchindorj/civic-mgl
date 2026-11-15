"use client";

import { useState } from "react";
import { MailOpen, Mail, Send, Settings, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import type { MailItem } from "@/data/seed";
import { Button, EmptyState, Field, HeaderIconButton, Page, PillTabs, Sheet, Toggle, inputCls, textareaCls, useTransient } from "@/components/ui";
import { cn, fmtDate, fmtTime, uid } from "@/lib/utils";

type Tab = "all" | "unread" | "read" | "sent";

export default function MailPage() {
  const { state, update, toast } = useAppState();
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useTransient<MailItem | null>(null);
  const [compose, setCompose] = useTransient(false);
  const [settings, setSettings] = useTransient(false);
  const [to, setTo] = useState("info@civicmgl.mn");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const list = state.mail.filter((m) =>
    tab === "all" ? !m.sent : tab === "unread" ? !m.read && !m.sent : tab === "read" ? m.read && !m.sent : m.sent,
  );

  return (
    <Page title="Үндэсний цахим шуудан" fallback="/profile" right={<HeaderIconButton icon={Settings} label="Тохиргоо" onClick={() => setSettings(true)} />}>
      <PillTabs
        tabs={[
          { value: "all", label: "Бүгд" },
          { value: "unread", label: "Уншаагүй" },
          { value: "read", label: "Уншсан" },
          { value: "sent", label: "Илгээсэн" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {list.length === 0 ? (
        <EmptyState title="Захидал алга байна" />
      ) : (
        <ul className="mt-5 space-y-3 pb-20">
          {list.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(m);
                  if (!m.read) update("mail", (all) => all.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
                }}
                className="flex w-full gap-4 rounded-card bg-card p-4 text-left shadow-sm"
              >
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", m.read ? "bg-soft text-slate-500" : "bg-brand/10 text-brand")}>
                  {m.read ? <MailOpen className="size-6" /> : <Mail className="size-6" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-muted">{m.date}</span>
                  <span className={cn("block truncate text-[17px]", m.read ? "text-ink" : "font-bold text-ink")}>{m.sent ? `→ ${m.to}` : m.from}</span>
                  <span className="block truncate text-[14px] text-muted">{m.subject}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="frame-fixed pointer-events-none bottom-0 z-20 flex justify-end px-4 pb-[max(env(safe-area-inset-bottom),24px)]">
        <button
          type="button"
          onClick={() => setCompose(true)}
          className="pointer-events-auto flex items-center gap-3 rounded-full brand-gradient px-6 py-4 text-[17px] font-semibold text-white shadow-xl"
        >
          Шинээр бичих <Send className="size-5" />
        </button>
      </div>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.subject}>
        {open && (
          <>
            <p className="text-[13px] text-muted">
              {open.sent ? `Хүлээн авагч: ${open.to}` : `Илгээгч: ${open.from}`} · {open.date}
            </p>
            <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-ink">{open.body}</p>
            <Button
              variant="danger"
              className="mt-6 w-full"
              onClick={() => {
                update("mail", (all) => all.filter((x) => x.id !== open.id));
                setOpen(null);
                toast("Захидлыг устгалаа");
              }}
            >
              <Trash2 className="size-5" /> Устгах
            </Button>
          </>
        )}
      </Sheet>

      <Sheet
        open={compose}
        onClose={() => setCompose(false)}
        title="Шинэ захидал"
        footer={
          <Button
            className="w-full"
            disabled={!subject.trim() || !body.trim() || !to.includes("@")}
            onClick={() => {
              const d = new Date();
              update("mail", (all) => [
                { id: uid("m"), from: state.sampleUser.email, to, date: `${fmtDate(d)} ${fmtTime(d)}`, subject, body, read: true, sent: true },
                ...all,
              ]);
              setSubject("");
              setBody("");
              setCompose(false);
              setTab("sent");
              toast("Захидал илгээгдлээ (демо)", "success");
            }}
          >
            <Send className="size-5" /> Илгээх
          </Button>
        }
      >
        <div className="space-y-4">
          <Field label="Хүлээн авагч" required>
            <input type="email" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Гарчиг" required>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Агуулга" required>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className={textareaCls} />
          </Field>
        </div>
      </Sheet>

      <Sheet open={settings} onClose={() => setSettings(false)} title="Шуудангийн тохиргоо">
        <div className="space-y-3">
          {(
            [
              ["email", "Шинэ захидлыг и-мэйлээр мэдэгдэх"],
              ["push", "Push мэдэгдэл"],
              ["sms", "SMS мэдэгдэл"],
            ] as const
          ).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between rounded-2xl bg-soft p-4">
              <span className="text-[15px] text-ink">{l}</span>
              <Toggle checked={state.notifPrefs[k]} onChange={(v) => update("notifPrefs", (p) => ({ ...p, [k]: v }))} label={l} />
            </div>
          ))}
        </div>
      </Sheet>
    </Page>
  );
}
