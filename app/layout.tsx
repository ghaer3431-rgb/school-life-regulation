import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "학교생활규정 검토 지원 시스템",
  description: "교육청 체크리스트 기준 학교생활규정 검토표 및 신구대조표 생성 도구",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
