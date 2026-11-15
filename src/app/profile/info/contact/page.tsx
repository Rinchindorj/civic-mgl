"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Button, Field, Page, inputCls } from "@/components/ui";

export default function ContactInfoPage() {
  const { state, setUser, toast } = useAppState();
  const [phone, setPhone] = useState(state.sampleUser.phone);
  const [email, setEmail] = useState(state.sampleUser.email);
  const valid = /^\d{8}$/.test(phone) && /^\S+@\S+\.\S+$/.test(email);

  return (
    <Page title="Холбоо барих мэдээлэл" fallback="/profile/info">
      <div className="space-y-5 rounded-card bg-card p-4 shadow-sm">
        <Field label="Утасны дугаар" required hint="8 оронтой дугаар">
          <input type="tel" inputMode="numeric" maxLength={8} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className={inputCls} />
        </Field>
        <Field label="Цахим шуудан" required>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Button
        className="mt-5 h-14 w-full"
        disabled={!valid}
        onClick={() => {
          setUser({ phone, email });
          toast("Холбоо барих мэдээлэл шинэчлэгдлээ", "success");
        }}
      >
        Хадгалах
      </Button>
    </Page>
  );
}
