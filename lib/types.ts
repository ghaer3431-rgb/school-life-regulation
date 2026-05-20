export type SchoolLevel = "초등학교" | "중학교" | "고등학교";
export type ReviewStatus = "보완 필요" | "확인 필요" | "적정" | "해당 없음";
export type BasisLevel =
  | "법령 필수"
  | "법령 연계"
  | "고시 연계"
  | "교육청 권고"
  | "학교 자율"
  | "담당자 확인 필요";

export type ReviewItem = {
  id: string;
  checklistNo: string;
  status: ReviewStatus;
  category: string;
  title: string;
  article: string;
  basis: BasisLevel;
  comment: string;
  current: string;
  revised: string;
  reason: string;
};

export type AnalysisSummary = {
  total: number;
  needsRevision: number;
  needsReview: number;
  adequate: number;
};

export type AnalysisResult = {
  schoolName: string;
  schoolLevel: SchoolLevel;
  generatedAt: string;
  summary: AnalysisSummary;
  items: ReviewItem[];
};
