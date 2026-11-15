# 🔒 SecureVault – AES-256 File Encryption Tool

> **Zero-Knowledge, Client-Side File Encryption Tool built with Next.js and the Web Crypto API.**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🌐 **Live Demo:** [https://securevault-lenovoleap-milestone08-capstone-project.vercel.app/](https://securevault-lenovoleap-milestone08-capstone-project.vercel.app/)

---

## 📖 Overview

SecureVault is a cybersecurity Capstone Project developed for the **Lenovo LEAP NextGen Scholar Program**. It solves the critical problem of **Data Protection** by providing a seamless way to encrypt sensitive files before they are stored or shared.

Unlike traditional cloud encryption tools, SecureVault operates on a **Zero-Knowledge architecture**. This means your files and passwords **never leave your computer**. All encryption and decryption happen locally in your browser using the native JavaScript Web Crypto API.

## ✨ Key Features

* **🔐 AES-256-GCM Encryption:** Utilizes military-grade symmetric encryption for both confidentiality and integrity.
* **🛡️ Zero-Knowledge Architecture:** The server (Vercel) only serves the static UI. It never sees, transmits, or stores your files or passwords.
* **🔑 PBKDF2 Key Derivation:** Derives a strong cryptographic key from your password using 100,000 iterations of SHA-256, protecting against brute-force and rainbow table attacks.
* **📦 Custom `.vault` Format:** The encrypted output file bundles the Salt, Initialization Vector (IV), and Encrypted Data into a single secure package.
* **🎨 Modern UI/UX:** Built with Tailwind CSS featuring a responsive, dark-themed glassmorphism design with drag-and-drop support.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Cryptography:** Web Crypto API (Native Browser API)
* **Icons:** Lucide React
* **Deployment:** Vercel

## 🚀 How It Works

1. **Encrypt:** Upload a file, enter a strong password, and click *Encrypt & Download*. The app generates a random 16-byte Salt and 12-byte IV, derives a key from your password, and encrypts the file.
2. **Decrypt:** Upload the `.vault` file, enter the same password, and click *Decrypt & Download*. The app extracts the Salt and IV from the file header, re-derives the key, and restores your original file.

## 💻 Run Locally

If you want to run this project on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ranejai954/SecureVault-Lenovo-LEAP-Miletsone08-Capstone-Project-Nov2026.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd SecureVault-Lenovo-LEAP-Miletsone08-Capstone-Project-Nov2026
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## 🔮 Future Scope

* **Asymmetric Encryption (RSA):** Implement public/private key pairs to allow secure file sharing without sharing a password.
* **Cloud Integration:** Direct integration with Azure Blob Storage or AWS S3 to encrypt files before they are uploaded to the cloud.
* **Bulk Processing:** Support for multiple files and folder zipping.
* **Password Strength Meter:** Real-time visual feedback on password entropy.

---

*Developed by **Jai Bhushan Rane** as part of the Lenovo LEAP Cybersecurity Internship (Nov 2026).*
