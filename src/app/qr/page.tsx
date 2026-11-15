"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Flashlight, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { useAppState, displayName } from "@/context/AppStateContext";
import { Button, Sheet, useTransient } from "@/components/ui";
import { SampleQr } from "@/components/Sample";
import { cn } from "@/lib/utils";

type Tab = "scan" | "mine";

const SIM_RESULTS = [
  { title: "Civic MGL-д QR ашиглан нэвтрэх", body: "Компьютер дээрх Civic MGL вэб сессийг баталгаажууллаа (демо)." },
  { title: "Лавлагаа шалгах", body: "SMP-261114-172045 дугаартай ЗАГВАР лавлагаа хүчинтэй байна." },
  { title: "Хурал, уулзалтын ирц бүртгэх", body: "“Иргэдийн нээлттэй хэлэлцүүлэг” арга хэмжээнд ирц бүртгэгдлээ (демо)." },
];

export default function QrPage() {
  const params = useSearchParams();
  const initial: Tab = params.get("tab") === "mine" ? "mine" : "scan";
  // Keyed so a new ?tab= value re-initialises the page even when Next preserves it.
  return <QrScreen key={initial} initial={initial} />;
}

function QrScreen({ initial }: { initial: Tab }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initial);
  const { state, toast } = useAppState();
  const u = state.sampleUser;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState(false);
  const [torch, setTorch] = useState(false);
  const [result, setResult] = useTransient<(typeof SIM_RESULTS)[number] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamera(false);
  };

  // Always release the camera when leaving the page.
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const openCamera = async () => {
    if (camera) return stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamera(true);
      toast("Камер нээгдлээ. Кодыг хүрээнд байрлуулна уу.", "success");
    } catch {
      toast("Камерт хандах эрх олгогдсонгүй. Загвар уншуулалт ашиглана уу.", "error");
    }
  };

  const simulate = () => setResult(SIM_RESULTS[Math.floor(Math.random() * SIM_RESULTS.length)]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1a1d24] text-white">
      {/* Camera / ambient backdrop */}
      <video ref={videoRef} playsInline muted className={cn("absolute inset-0 h-full w-full object-cover", !camera && "hidden")} />
      {!camera && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#4a4f5c,transparent_60%),radial-gradient(circle_at_80%_70%,#3a3226,transparent_55%)]" />
      )}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-[max(env(safe-area-inset-top),14px)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Буцах"
            onClick={() => {
              stopCamera();
              if (window.history.length > 1) router.back();
              else router.push("/");
            }}
            className="grid size-11 place-items-center"
          >
            <ChevronLeft className="size-7" />
          </button>
          <h1 className="text-[18px] font-bold">QR код уншуулах</h1>
          <button
            type="button"
            aria-label="Зурагнаас унших"
            onClick={() => fileRef.current?.click()}
            className="grid size-10 place-items-center rounded-xl bg-white text-[#1a1d24]"
          >
            <ImageIcon className="size-6" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                toast("Зургийг уншиж байна…");
                setTimeout(simulate, 700);
              }
              e.target.value = "";
            }}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-white/20 p-1.5 backdrop-blur-md">
          {(
            [
              ["scan", "QR уншуулах"],
              ["mine", "Миний QR"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                if (v === "mine") stopCamera();
                setTab(v);
              }}
              className={cn("rounded-xl py-3 text-[16px] font-semibold transition", tab === v ? "bg-white text-[#1a1d24]" : "text-white")}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "scan" ? (
          <>
            <button
              type="button"
              onClick={simulate}
              aria-label="Загвар QR уншуулах"
              className="relative mx-auto mt-8 aspect-square w-[74%]"
            >
              {/* Corner brackets */}
              {["top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl", "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl", "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl", "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl"].map((c) => (
                <span key={c} className={cn("absolute size-12 border-white", c)} />
              ))}
              <span className="absolute inset-x-6 h-0.5 animate-scanline bg-brand shadow-[0_0_14px_3px_var(--brand-primary)]" />
              <span className="absolute inset-x-0 bottom-[38%] text-[13px] font-semibold text-white/80">Энд дарж загвар код уншуулах</span>
            </button>
            <button
              type="button"
              aria-label="Гэрэл"
              aria-pressed={torch}
              onClick={() => {
                setTorch((t) => !t);
                const track = streamRef.current?.getVideoTracks()[0];
                track?.applyConstraints({ advanced: [{ torch: !torch } as MediaTrackConstraintSet] }).catch(() => {});
              }}
              className={cn("mx-auto -mt-16 grid size-11 place-items-center rounded-full", torch ? "bg-amber-300 text-black" : "text-white")}
            >
              <Flashlight className="size-6" />
            </button>

            <div className="mt-12 text-center">
              <p className="text-[17px] font-bold">Дараах QR кодыг уншуулах боломжтой</p>
              <ul className="mt-4 space-y-3 text-[15px] text-white/90">
                <li>civicmgl.mn-д QR ашиглан нэвтрэх</li>
                <li>Лавлагаа шалгах</li>
                <li>Хурал, уулзалтын ирц бүртгэх</li>
              </ul>
            </div>
            <Button variant="white" onClick={openCamera} className="mt-auto h-14 w-full text-[16px]">
              {camera ? "Камер хаах" : "AR камер нээх"}
            </Button>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative rounded-3xl bg-white p-4">
              <SampleQr seed={u.demoId + u.email} className="size-60" />
              <span className="absolute -top-2 -right-2 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black">SAMPLE</span>
            </div>
            <p className="mt-6 text-[18px] font-bold">{displayName(u)}</p>
            <p className="mt-3 text-[15px] text-white/90">{u.email}</p>
            <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-white/90">
              Энэхүү ЗАГВАР QR код нь таны демо гишүүнчлэлийн дугаар ({u.demoId})-ыг төлөөлнө.
            </p>
          </div>
        )}
      </div>

      <Sheet open={!!result} onClose={() => setResult(null)} title="QR амжилттай уншигдлаа" center>
        {result && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
            <p className="mt-3 text-[17px] font-bold">{result.title}</p>
            <p className="mt-2 text-[15px] text-muted">{result.body}</p>
            <Button className="mt-5 w-full" onClick={() => setResult(null)}>
              Ойлголоо
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
