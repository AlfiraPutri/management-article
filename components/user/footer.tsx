import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white p-4 flex items-center justify-center gap-3">
      <Image
        src="/images/Logo.png"
        alt="Logipsum"
        width={134}
        height={24}
        className="mb-2"
      />
      © 2025 Blog genzet. All rights reserved.
    </footer>
  );
}
