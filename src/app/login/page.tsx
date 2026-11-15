"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, UserRoundCheck } from "lucide-react";
import { useAppState, type AuthResult } from "@/context/AppStateContext";
import { DEMO_EMAIL, DEMO_PASSWORD, MIN_PASSWORD } from "@/lib/accounts";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";
import { APP_VERSION } from "@/components/AppShell";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

function Field({
  label,
  icon: Icon,
  trailing,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: typeof Mail; trailing?: React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-ink">
        {label}
      </label>
      <div className="flex h-[52px] items-center gap-2.5 rounded-2xl bg-soft px-4 ring-1 ring-transparent transition focus-within:bg-card focus-within:ring-2 focus-within:ring-brand">
        <Icon className="size-5 shrink-0 text-muted" />
        <input id={id} className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70" {...input} />
        {trailing}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, register, loginDemo } = useAppState();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<AuthResult>) => {
    setBusy(true);
    setError("");
    const res = await action();
    setBusy(false);
    if (res.ok) router.replace("/");
    else setError(res.error);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(() => (mode === "login" ? login(email, password) : register(email, password)));
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
  };

  return (
    <div className="hero-glow flex min-h-screen flex-col px-5 pt-[max(env(safe-area-inset-top),36px)] pb-8">
      {/* Signed-out screen always shows the default brand, never a previous account's. */}
      <Logo className="mx-auto mt-6 w-fit scale-[1.2]" />
      <p className="mt-5 text-center text-[15px] text-muted">Төрийн үйлчилгээ, мэдээллийг нэг дороос</p>

      <div className="mt-8 rounded-2xl bg-card p-5 shadow-xl shadow-navy/5">
        <div role="tablist" aria-label="Нэвтрэх эсвэл бүртгүүлэх" className="grid grid-cols-2 gap-1 rounded-2xl bg-soft p-1">
          {(
            [
              ["login", "Нэвтрэх"],
              ["register", "Бүртгүүлэх"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "h-11 rounded-xl text-[15px] font-bold transition",
                mode === m ? "bg-card text-brand shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field
            label={mode === "register" ? "Gmail хаяг" : "И-мэйл хаяг"}
            icon={Mail}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            label="Нууц үг"
            icon={Lock}
            type={showPw ? "text" : "password"}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            placeholder={mode === "register" ? `Дор хаяж ${MIN_PASSWORD} тэмдэгт` : "••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Нууц үг нуух" : "Нууц үг харах"}
                className="grid size-9 place-items-center rounded-xl text-muted hover:text-ink"
              >
                {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            }
          />

          {error && (
            <p role="alert" className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-[14px] font-semibold text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="h-[52px] w-full text-[16px]">
            {busy ? "Түр хүлээнэ үү…" : mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13.5px] text-muted">
          {mode === "login" ? "Бүртгэлгүй юу? " : "Бүртгэлтэй юу? "}
          <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")} className="font-bold text-brand">
            {mode === "login" ? "Бүртгүүлэх" : "Нэвтрэх"}
          </button>
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-card/70 p-4 ring-1 ring-line">
        <Button variant="outline" disabled={busy} className="w-full" onClick={() => void run(loginDemo)}>
          <UserRoundCheck className="size-5" /> Туршилтын хаягаар нэвтрэх
        </Button>
        <p className="mt-2.5 text-center text-[12px] text-muted">
          {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
      </div>

      <p className="mt-auto pt-6 text-center text-[12px] text-muted">
        Демо систем: бүртгэл зөвхөн энэ хөтөч дээр хадгалагдана. Бодит нууц үгээ бүү ашиглаарай. · {APP_VERSION}
      </p>
    </div>
  );
}
