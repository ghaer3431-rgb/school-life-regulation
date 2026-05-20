"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Filter,
  School,
  Search,
  Upload,
} from "lucide-react";
import type { AnalysisResult, ReviewItem, ReviewStatus, SchoolLevel } from "@/lib/types";
import { firebaseReady } from "@/lib/firebase";
import { runMockAnalysis } from "@/lib/mockAnalyzer";

const schoolLevels: SchoolLevel[] = ["초등학교", "중학교", "고등학교"];
const statusFilters: Array<"전체" | ReviewStatus> = ["전체", "보완 필요", "확인 필요", "적정", "해당 없음"];

const statusStyles: Record<ReviewStatus, string> = {
  "보완 필요": "bg-red-50 text-red-700 border-red-200",
  "확인 필요": "bg-amber-50 text-amber-700 border-amber-200",
  적정: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "해당 없음": "bg-slate-50 text-slate-600 border-slate-200",
};

export default function HomePage() {
  const [schoolName, setSchoolName] = useState("경포중학교");
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>("중학교");
  const [regulationFile, setRegulationFile] = useState<File | null>(null);
  const [checklistFile, setChecklistFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selected, setSelected] = useState<ReviewItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<"전체" | ReviewStatus>("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = useMemo(() => {
    if (!result) return ["전체"];
    return ["전체", ...Array.from(new Set(result.items.map((item) => item.category)))];
  }, [result]);

  const filteredItems = useMemo(() => {
    if (!result) return [];
    return result.items.filter((item) => {
      const statusOk = statusFilter === "전체" || item.status === statusFilter;
      const categoryOk = categoryFilter === "전체" || item.category === categoryFilter;
      return statusOk && categoryOk;
    });
  }, [result, statusFilter, categoryFilter]);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    const analysis = await runMockAnalysis({
      schoolName,
      schoolLevel,
      regulationFile,
      checklistFile,
    });
    setResult(analysis);
    setSelected(analysis.items[0] ?? null);
    setIsAnalyzing(false);
  }

  function downloadJson() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.schoolName}_학교생활규정_검토결과.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-2 text-white">
              <School size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">학교생활규정 제·개정 검토 지원 시스템</h1>
              <p className="text-sm text-slate-500">
                교육청 체크리스트 기준 학교생활규정 검토표 및 신구대조표 생성 도구
              </p>
            </div>
          </div>
          <button
            onClick={downloadJson}
            disabled={!result}
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="mr-2 h-4 w-4" /> 결과 다운로드
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-5 px-6 py-6">
        <section className="col-span-12 space-y-5 lg:col-span-4">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <h2 className="text-lg font-semibold">문서 및 체크리스트 업로드</h2>
            </div>

            <label className="mb-2 block text-sm font-medium">학교급</label>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {schoolLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSchoolLevel(level)}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${
                    schoolLevel === level
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "bg-white hover:bg-slate-100"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm font-medium">학교명</label>
            <input
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              className="mb-4 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="예: 경포중학교"
            />

            <UploadInput
              label="학교생활규정 파일"
              description="hwp, hwpx, pdf, docx 지원 예정"
              file={regulationFile}
              onChange={setRegulationFile}
            />

            <div className="mt-3">
              <UploadInput
                label="교육청 체크리스트 파일"
                description="xlsx 권장"
                file={checklistFile}
                onChange={setChecklistFile}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isAnalyzing ? "분석 중..." : "분석 시작"}
            </button>

            <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-xs leading-6 text-slate-600">
              Firebase 연결 상태: {firebaseReady ? "연결됨" : "환경변수 미설정"} <br />
              현재 v0.1은 화면과 흐름 검증용이며, 실제 파일 파싱은 다음 단계에서 연결합니다.
            </div>
          </Card>

          {result && (
            <Card>
              <h2 className="mb-4 text-lg font-semibold">분석 요약</h2>
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard label="전체 점검" value={result.summary.total} />
                <SummaryCard label="보완 필요" value={result.summary.needsRevision} tone="red" />
                <SummaryCard label="확인 필요" value={result.summary.needsReview} tone="amber" />
                <SummaryCard label="적정" value={result.summary.adequate} tone="green" />
              </div>
            </Card>
          )}
        </section>

        <section className="col-span-12 space-y-5 lg:col-span-8">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">검토표</h2>
                <p className="text-sm text-slate-500">
                  교육청 체크리스트 항목별로 반영 여부를 확인하고 필요한 항목만 신구대조표로 반영합니다.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm text-slate-500">
                <Search className="h-4 w-4" /> 검색 기능 예정
              </div>
            </div>

            <div className="mb-4 space-y-3">
              <FilterRow options={statusFilters} value={statusFilter} onChange={setStatusFilter} />
              <FilterRow options={categories} value={categoryFilter} onChange={setCategoryFilter} />
            </div>

            {!result ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`w-full rounded-3xl border bg-white p-4 text-left transition hover:shadow-md ${
                      selected?.id === item.id ? "border-slate-900 shadow-sm" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                          >
                            {item.status}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {item.basis}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {item.article}
                          </span>
                        </div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.comment}</p>
                      </div>
                      <ChevronRight className="mt-2 h-5 w-5 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {selected && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">상세 보기 · 신구대조표 초안</h2>
                  <p className="text-sm text-slate-500">
                    선택한 점검 항목의 현행 조항, AI 개정안 초안, 개정 사유를 확인합니다.
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="mb-4 rounded-3xl bg-slate-100 p-4">
                <div className="text-sm text-slate-500">점검 항목</div>
                <div className="mt-1 text-lg font-bold">{selected.title}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-1">관련 조항: {selected.article}</span>
                  <span className="rounded-full bg-white px-3 py-1">체크리스트 근거: {selected.basis}</span>
                  <span className="rounded-full bg-white px-3 py-1">학교급: {schoolLevel}</span>
                  <span className="rounded-full bg-white px-3 py-1">판단 기준: 교육청 체크리스트 우선</span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <TextBox title="현행" content={selected.current} />
                <TextBox title="AI 개정안 초안" content={selected.revised} highlight />
              </div>

              <div className="mt-4 rounded-3xl border bg-white p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-5 w-5" /> 개정 사유
                </div>
                <p className="text-sm leading-6 text-slate-700">{selected.reason}</p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-slate-100">
                  담당자 메모
                </button>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  신구대조표 후보로 반영
                </button>
              </div>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border bg-white p-5 shadow-sm">{children}</div>;
}

function UploadInput({
  label,
  description,
  file,
  onChange,
}: {
  label: string;
  description: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block cursor-pointer rounded-3xl border-2 border-dashed bg-white p-5 text-center hover:bg-slate-50">
      <FileText className="mx-auto mb-2 h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium">{file ? file.name : label}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <input
        type="file"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function SummaryCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "red" | "amber" | "green";
}) {
  const toneClass = {
    slate: "bg-slate-100 text-slate-900",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className={`rounded-3xl p-4 ${toneClass}`}>
      <div className="text-sm opacity-80">{label}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
    </div>
  );
}

function FilterRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="h-4 w-4 text-slate-500" />
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            value === option ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TextBox({ title, content, highlight = false }: { title: string; content: string; highlight?: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 ${highlight ? "bg-slate-900 text-white" : "bg-white"}`}>
      <div className={`mb-3 text-sm font-semibold ${highlight ? "text-slate-200" : "text-slate-500"}`}>
        {title}
      </div>
      <pre className="whitespace-pre-wrap break-keep font-sans text-sm leading-7">{content}</pre>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed bg-slate-50 p-10 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-slate-400" />
      <h3 className="font-semibold">아직 분석 결과가 없습니다.</h3>
      <p className="mt-2 text-sm text-slate-500">학교생활규정과 체크리스트를 업로드한 뒤 분석을 시작하세요.</p>
    </div>
  );
}
