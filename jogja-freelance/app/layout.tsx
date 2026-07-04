import type { Metadata } from "next";
import "./globals.css";
import FloatingChat from "./components/ui/FloatingChat";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Jogja Freelance Passport",
  description: "Platform untuk freelancer menemukan peluang & panduan harian di Yogyakarta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <FloatingChat />
        </AuthProvider>
      </body>
    </html>
  );
}
