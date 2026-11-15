"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, Paperclip } from "lucide-react";
import { useAppState, type Petition } from "@/context/AppStateContext";
import { Button, Field, Sheet, inputCls, textareaCls } from "./ui";
import { SampleBadge } from "./Sample";
import { cn, fmtDate, fmtTime, refNumber, uid } from "@/lib/utils";

export interface FormFieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea" | "date" | "number" | "file" | "time";
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

/**
 * Generic civic request form. Logs to petitions (Өргөдөл, гомдол) and/or service
 * history, adds a notification, and shows a SAMPLE confirmation.
 */
export function RequestForm({
  notice,
  fields,
  kind,
  submitLabel = "Илгээх",
  logPetition = true,
  logHistory = true,
  resultTitle = "Амжилттай илгээгдлээ",
  renderResult,
  titleFrom,
}: {
  notice?: ReactNode;
  fields: FormFieldDef[];
  kind: string;
  submitLabel?: string;
  logPetition?: boolean;
  logHistory?: boolean;
  resultTitle?: string;
  renderResult?: (values: Record<string, string>, ref: string) => ReactNode;
  titleFrom?: (values: Record<string, string>) => string;
}) {
  const { update, addHistory, addNotification, toast } = useAppState();
  const initial = () => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? (f.type === "select" ? f.options?.[0] ?? "" : "")]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [result, setResult] = useState<{ ref: string; values: Record<string, string> } | null>(null);
  const submitted = useRef(false);

  // Clear a completed form when the page is hidden, but keep unsent drafts.
  useLayoutEffect(() => {
    return () => {
      if (submitted.current) {
        submitted.current = false;
        setResult(null);
        setValues(initial());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const missing = fields.filter((f) => f.required && !f.readOnly && !values[f.name]?.trim());

  const submit = () => {
    if (missing.length) {
      toast(`“${missing[0].label}” талбарыг бөглөнө үү`, "error");
      return;
    }
    const ref = refNumber("REQ");
    const now = new Date();
    const title = titleFrom?.(values) ?? kind;
    const body = values.content || values.description || values.message || Object.values(values).filter(Boolean).slice(-1)[0] || "";
    if (logPetition) {
      const p: Petition = { id: uid("pt"), ref, kind, title, body, date: `${fmtDate(now)} ${fmtTime(now, false)}`, status: "Хүлээн авсан" };
      update("petitions", (all) => [p, ...all]);
    }
    if (logHistory) {
      addHistory({
        id: uid("h"),
        ref,
        date: `${fmtDate(now, "/")} ${fmtTime(now, false)}`,
        title,
        status: "Илгээсэн",
        kind: "petition",
        details: Object.fromEntries(fields.filter((f) => f.type !== "textarea" && f.type !== "file").map((f) => [f.label, values[f.name] || "—"])),
      });
    }
    addNotification({ type: "resolution", title: "Хүсэлт хүлээн авлаа", body: `${kind}: ${ref} дугаартай хүсэлтийг хүлээн авлаа (ЗАГВАР).` });
    submitted.current = true;
    setResult({ ref, values });
  };

  return (
    <>
      {notice}
      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {fields.map((f) => (
          <Field key={f.name} label={f.label} required={f.required}>
            {f.type === "select" ? (
              <span className="relative block">
                <select value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} className={cn(inputCls, "appearance-none pr-10")}>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
              </span>
            ) : f.type === "textarea" ? (
              <textarea value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} className={textareaCls} />
            ) : f.type === "file" ? (
              <span className={cn(inputCls, "flex cursor-pointer items-center gap-3")}>
                <Paperclip className="size-5 text-muted" />
                <span className="flex-1 truncate text-muted">{values[f.name] || "Файл хавсаргах (заавал биш)"}</span>
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => set(f.name, e.target.files?.[0]?.name ?? "")} />
              </span>
            ) : (
              <input
                type={f.type ?? "text"}
                value={values[f.name]}
                readOnly={f.readOnly}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
                className={inputCls}
              />
            )}
          </Field>
        ))}
        <Button type="submit" className="h-14 w-full text-[16px]">
          {submitLabel}
        </Button>
      </form>

      <Sheet open={!!result} onClose={() => setResult(null)} title={resultTitle}>
        {result && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
            <p className="mt-3 text-[15px] text-muted">Бүртгэлийн дугаар</p>
            <p className="text-[20px] font-extrabold tracking-wide text-ink">{result.ref}</p>
            <SampleBadge className="mt-2" />
            {renderResult?.(result.values, result.ref)}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link href={logPetition ? "/profile/petitions" : "/profile/history"} className="grid h-12 place-items-center rounded-2xl bg-soft text-[15px] font-semibold text-ink">
                Миний хүсэлтүүд
              </Link>
              <Button
                onClick={() => {
                  setResult(null);
                  setValues(initial());
                  submitted.current = false;
                }}
              >
                Дуусгах
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}

export function Notice({ title = "Санамж", children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[17px] font-medium text-ink">{title}</p>
      <p className="mt-1 text-justify text-[14.5px] leading-relaxed tracking-wide text-muted">{children}</p>
    </div>
  );
}
