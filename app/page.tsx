"use client";

import { useState } from "react";
import { Lock, Unlock, ShieldCheck, Key, FileUp } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<{ msg: string; error: boolean } | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const getKeyFromPassword = async (password: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const handleEncrypt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEncrypting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      setStatus({ msg: "Please provide a file and password.", error: true });
      setIsEncrypting(false);
      return;
    }

    try {
      const fileBuffer = await file.arrayBuffer();
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const key = await getKeyFromPassword(password, salt);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        key,
        fileBuffer
      );

      const combinedBuffer = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
      combinedBuffer.set(salt, 0);
      combinedBuffer.set(iv, salt.length);
      combinedBuffer.set(new Uint8Array(encryptedContent), salt.length + iv.length);

      const blob = new Blob([combinedBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name + ".vault";
      a.click();
      URL.revokeObjectURL(url);

      setStatus({ msg: "File encrypted successfully! The .vault file has been downloaded.", error: false });
    } catch (err) {
      setStatus({ msg: "Encryption failed.", error: true });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDecrypting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      setStatus({ msg: "Please provide a file and password.", error: true });
      setIsDecrypting(false);
      return;
    }

    try {
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      const salt = fileBytes.slice(0, 16);
      const iv = fileBytes.slice(16, 28);
      const encryptedData = fileBytes.slice(28);

      const key = await getKeyFromPassword(password, salt);

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        key,
        encryptedData
      );

      const blob = new Blob([decryptedContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".vault", "");
      a.click();
      URL.revokeObjectURL(url);

      setStatus({ msg: "File decrypted successfully! Check your downloads.", error: false });
    } catch (err) {
      setStatus({ msg: "Decryption failed. Incorrect password or corrupted file.", error: true });
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    // Glowing Background Effect
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold flex items-center justify-center gap-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            <ShieldCheck size={48} className="text-blue-400" /> SecureVault
          </h1>
          <p className="text-slate-400 text-lg font-mono">// Zero-Knowledge Client-Side AES-256 Encryption</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Encrypt Card */}
          <form onSubmit={handleEncrypt} className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-200">
              <Lock className="text-blue-400" /> Encrypt File
            </h2>
            <div className="space-y-5">
              <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors bg-slate-950/50 cursor-pointer">
                <input type="file" name="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <FileUp className="mx-auto text-slate-500 mb-2" size={32} />
                <p className="text-sm text-slate-400">Drag & drop or <span className="text-blue-400 font-semibold">browse</span></p>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input type="password" name="password" placeholder="Enter strong password" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all" />
              </div>
              <button type="submit" disabled={isEncrypting} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                {isEncrypting ? "Encrypting..." : "Encrypt & Download"}
              </button>
            </div>
          </form>

          {/* Decrypt Card */}
          <form onSubmit={handleDecrypt} className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl hover:border-green-500/50 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-200">
              <Unlock className="text-green-400" /> Decrypt File
            </h2>
            <div className="space-y-5">
              <div className="relative border-2 border-dashed border-slate-700 hover:border-green-500 rounded-xl p-6 text-center transition-colors bg-slate-950/50 cursor-pointer">
                <input type="file" name="file" accept=".vault" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <FileUp className="mx-auto text-slate-500 mb-2" size={32} />
                <p className="text-sm text-slate-400">Upload a <span className="text-green-400 font-semibold">.vault</span> file</p>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input type="password" name="password" placeholder="Enter decryption password" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white transition-all" />
              </div>
              <button type="submit" disabled={isDecrypting} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20">
                {isDecrypting ? "Decrypting..." : "Decrypt & Download"}
              </button>
            </div>
          </form>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`mt-8 p-4 rounded-xl text-center font-medium border backdrop-blur-md ${status.error ? 'bg-red-900/30 text-red-400 border-red-800/50' : 'bg-green-900/30 text-green-400 border-green-800/50'}`}>
            {status.msg}
          </div>
        )}
      </div>
    </main>
  );
}