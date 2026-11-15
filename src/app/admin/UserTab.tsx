"use client";

import { useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { useAppState, displayName, type SampleUser } from "@/context/AppStateContext";
import { Avatar } from "@/components/Sample";
import { Button } from "@/components/ui";
import { ageFrom, fileToAvatar } from "@/lib/utils";
import { AdminCard, TextField, smallInput } from "./fields";
import { CardHolderManager } from "./CardHolderManager";

export function UserTab() {
  const { state, setUser, toast } = useAppState();
  const u = state.sampleUser;
  const fileRef = useRef<HTMLInputElement>(null);
  const age = ageFrom(u.birthdate);
  const field = (label: string, key: keyof SampleUser, type = "text") => (
    <TextField label={label} type={type} value={u[key]} onChange={(v) => setUser({ [key]: v } as Partial<SampleUser>)} />
  );

  return (
    <>
      <AdminCard title="Профайл зураг" desc="Зураг 320×320 болж жижигрээд энэ төхөөрөмжид хадгалагдана">
        <div className="flex items-center gap-4">
          <Avatar user={u} className="size-20" />
          <div className="flex flex-1 flex-col gap-2">
            <Button variant="soft" className="h-11" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" /> Зураг оруулах
            </Button>
            {u.avatar && (
              <Button variant="danger" className="h-11" onClick={() => setUser({ avatar: "" })}>
                <Trash2 className="size-4" /> Устгах
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (!f.type.startsWith("image/")) return toast("Зөвхөн зураг оруулна уу", "error");
              try {
                setUser({ avatar: await fileToAvatar(f) });
                toast("Зураг шинэчлэгдлээ", "success");
              } catch {
                toast("Зургийг уншиж чадсангүй", "error");
              }
            }}
          />
        </div>
        <p className="mt-3 rounded-xl bg-soft p-3 text-[13px] text-muted">
          Харагдах нэр: <b className="text-ink">{displayName(u)}</b>
        </p>
      </AdminCard>

      <AdminCard title="Хувийн мэдээлэл (ЗАГВАР)">
        <div className="space-y-2.5">
          {field("Ургийн овог", "clan")}
          <div className="grid grid-cols-2 gap-2">
            {field("Эцэг/эхийн нэр", "lastName")}
            {field("Нэр", "firstName")}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[12.5px] font-semibold text-muted">Хүйс</span>
              <select value={u.gender} onChange={(e) => setUser({ gender: e.target.value })} className={smallInput}>
                <option>Эрэгтэй</option>
                <option>Эмэгтэй</option>
              </select>
            </label>
            {field("Төрсөн огноо", "birthdate", "date")}
          </div>
          <p className="text-[13px] text-muted">
            Нас (автоматаар): <b className="text-ink">{age ?? "—"}</b>
          </p>
        </div>
      </AdminCard>

      <AdminCard title="Демо дугаарууд & холбоо барих">
        <div className="space-y-2.5">
          {field("Демо ID (CMGL-...)", "demoId")}
          {field("Демо регистр", "sampleReg")}
          {field("Утас", "phone", "tel")}
          {field("И-мэйл (харагдах)", "email", "email")}
          {field("Бүртгэлийн Gmail (personalEmail)", "personalEmail", "email")}
        </div>
      </AdminCard>

      <CardHolderManager />
    </>
  );
}
