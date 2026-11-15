"use client";

import { Phone, Mail, MessagesSquare, Info, MapPin } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Button, MenuGroup, MenuRow, Page, Sheet, textareaCls, useTransient } from "@/components/ui";
import { useState } from "react";

export default function ContactPage() {
  const { toast } = useAppState();
  const [chat, setChat] = useTransient(false);
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([{ me: false, text: "Сайн байна уу! Civic MGL демо туслах байна. Танд юугаар туслах вэ?" }]);
  const [text, setText] = useState("");

  return (
    <Page title="Холбоо барих">
      <MenuGroup>
        <MenuRow
          icon={Phone}
          iconClass="bg-sky-500/12 text-sky-700"
          title="Лавлах утас"
          subtitle="7000-0000 (жишээ) · 24/7"
          onClick={() => { window.location.href = "tel:70000000"; }}
        />
        <MenuRow icon={Mail} iconClass="bg-sky-500/12 text-sky-700" title="И-мэйл" subtitle="info@civicmgl.mn" onClick={() => { window.location.href = "mailto:info@civicmgl.mn"; }} />
        <MenuRow icon={MessagesSquare} iconClass="bg-sky-500/12 text-sky-700" title="Онлайн чат" subtitle="Ажлын өдөр 09:00–18:00" onClick={() => setChat(true)} />
        <MenuRow icon={MapPin} iconClass="bg-sky-500/12 text-sky-700" title="Үйлчилгээний цэгүүд" href="/support/locations" />
      </MenuGroup>
      <div className="mt-6 rounded-card bg-sky-400/15 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white">
            <Info className="size-6 fill-brand text-white" />
          </span>
          <p className="text-[15px] leading-relaxed text-ink">Энэ бол демо аппликейшн. Утасны дугаар, и-мэйл нь жишээ бөгөөд бодит хариу ирэхгүй.</p>
        </div>
      </div>

      <Sheet
        open={chat}
        onClose={() => setChat(false)}
        title="Онлайн чат"
        footer={
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              setMsgs((m) => [...m, { me: true, text }, { me: false, text: "Баярлалаа! Таны асуултыг демо оператор хүлээн авлаа. Тусламж хэсгээс түгээмэл асуултуудыг харна уу." }]);
              setText("");
            }}
          >
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} className={`${textareaCls} !min-h-12`} placeholder="Мессеж бичих…" />
            <Button type="submit" className="!px-4" onClick={() => !text.trim() && toast("Мессеж бичнэ үү")}>
              Илгээх
            </Button>
          </form>
        }
      >
        <div className="space-y-2.5">
          {msgs.map((m, i) => (
            <p key={i} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] ${m.me ? "ml-auto bg-brand text-white" : "bg-soft text-ink"}`}>
              {m.text}
            </p>
          ))}
        </div>
      </Sheet>
    </Page>
  );
}
