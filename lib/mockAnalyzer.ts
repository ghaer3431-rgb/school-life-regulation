import type { AnalysisResult, ReviewItem, SchoolLevel } from "./types";

const baseItems: ReviewItem[] = [
  {
    id: "CL-001",
    checklistNo: "1",
    status: "보완 필요",
    category: "적용근거",
    title: "적용근거 및 고시 명칭 최신화",
    article: "제3조",
    basis: "고시 연계",
    comment:
      "현행 규정의 적용근거에 구 고시 번호가 남아 있거나 최신 고시·법령 개정 사항이 충분히 반영되지 않았는지 확인합니다.",
    current:
      "제3조【적용근거】 이 규정은 ... 교육부 고시 제2023-28호 「교원의 학생생활지도에 관한 고시」에 근거하여 ...",
    revised:
      "제3조【적용근거】 이 규정은 「초·중등교육법」, 「초·중등교육법 시행령」, 교육부 고시 「교원의 학생생활지도에 관한 고시」 등 최신 법령과 고시에 근거하여 학교생활규정에 관한 세부 사항을 정한다.",
    reason: "2026. 3. 1. 시행 고시 및 상위법 개정 사항 반영 필요",
  },
  {
    id: "CL-002",
    checklistNo: "2",
    status: "보완 필요",
    category: "스마트기기",
    title: "휴대전화 관련 용어의 스마트기기 정비",
    article: "제29조, 제83조",
    basis: "법령 연계",
    comment:
      "현행 규정의 ‘휴대전화’, ‘휴대폰’, ‘통신기기’ 표현을 ‘휴대전화 등 스마트기기’ 또는 ‘스마트기기’ 중심으로 정비할 필요가 있습니다.",
    current:
      "제29조【휴대전화 등 통신기기】\n① 휴대폰 등 전자기기는 등교 시 학급별 휴대폰 보관함에 보관하며, 하교 시 수령한다.",
    revised:
      "제29조【휴대전화 등 스마트기기】\n① 학생은 수업 중 휴대전화 등 스마트기기를 사용해서는 안 된다. 다만, 장애 또는 특수교육 지원, 교육 목적, 긴급 상황 대응 등 학교의 장과 교원이 허용하는 경우에는 사용할 수 있다.",
    reason: "초·중등교육법 및 학생생활지도 고시 개정에 따른 스마트기기 용어 반영",
  },
  {
    id: "CL-003",
    checklistNo: "3",
    status: "보완 필요",
    category: "개별학생교육지원",
    title: "기존 분리 조항의 개별학생교육지원 체계 반영",
    article: "제84조, 제90조, 별지2",
    basis: "고시 연계",
    comment:
      "기존 ‘분리’ 중심 조항을 개별학생교육지원의 장소, 시간, 학습지원 방법 등으로 재구성할 필요가 있습니다.",
    current:
      "제84조 제6항\n학교의 장과 교원은 학생이 교육활동을 방해하여 다른 학생들의 학습권 보호가 필요하다고 판단하는 경우 해당 학생을 분리할 수 있다.",
    revised:
      "제○조【개별학생교육지원】\n① 학교의 장은 교육활동 보호와 학생의 학습권 보장을 위하여 개별학생교육지원이 필요한 경우 장소, 시간, 학습지원 방법 및 보호자 안내 절차를 정하여 운영할 수 있다.",
    reason: "개별학생교육지원 조항 신설 및 기존 분리 조항의 구조 정비",
  },
  {
    id: "CL-004",
    checklistNo: "4",
    status: "확인 필요",
    category: "징계",
    title: "학생선도위원회 사전 통지 및 의견진술 절차 확인",
    article: "제68조, 제70조",
    basis: "법령 필수",
    comment:
      "10일 전 통지 및 학생·보호자 의견진술 기회는 반영되어 있는지 확인이 필요합니다.",
    current:
      "학생 징계 처분 사전통지서, 의견제출서, 수령확인서는 선도위원회 개최 10일전까지 보호자에게 등기우편으로 송달하여야 한다.",
    revised:
      "현행 유지 가능. 다만 학생 및 보호자에게 일시, 장소, 불참 시 처리 방법, 의견진술 방법을 명확히 안내하는 서식 정비를 권장합니다.",
    reason: "적법절차 보장 및 학생·보호자 의견진술권 확인",
  },
  {
    id: "CL-005",
    checklistNo: "5",
    status: "적정",
    category: "개정절차",
    title: "학교생활규정 제·개정위원회 및 의견수렴 절차",
    article: "제96조~제101조",
    basis: "교육청 권고",
    comment:
      "제·개정위원회 구성, 학생·보호자·교원 의견수렴, 학교운영위원회 심의, 공포 및 안내 절차가 반영되어 있는지 확인합니다.",
    current:
      "위원회는 설문조사, 토론회, 공청회 등의 방법으로 전체 학생을 비롯한 학교 구성원의 의견을 수렴하는 절차를 진행하여 그 결과를 반영해야 한다.",
    revised:
      "현행 유지 가능. 최종 점검표의 의견수렴 방식 및 반영 비율 관련 항목과 대조하여 확인한다.",
    reason: "규정 제·개정 절차의 민주성 및 교육공동체 의견수렴 확인",
  },
];

function summarize(items: ReviewItem[]) {
  return {
    total: items.length,
    needsRevision: items.filter((item) => item.status === "보완 필요").length,
    needsReview: items.filter((item) => item.status === "확인 필요").length,
    adequate: items.filter((item) => item.status === "적정").length,
  };
}

export async function runMockAnalysis(params: {
  schoolName: string;
  schoolLevel: SchoolLevel;
  regulationFile?: File | null;
  checklistFile?: File | null;
}): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  let items = [...baseItems];

  if (params.schoolLevel === "고등학교") {
    items = [
      ...items,
      {
        id: "CL-HIGH-001",
        checklistNo: "고등-1",
        status: "확인 필요",
        category: "징계",
        title: "고등학교 퇴학처분 절차 확인",
        article: "징계 관련 조항",
        basis: "법령 필수",
        comment:
          "고등학교의 경우 퇴학처분 관련 절차, 진로상담, 재심 절차가 학교생활규정에 적절히 반영되어 있는지 확인해야 합니다.",
        current: "고등학교 선택 시 퇴학처분 조항 확인 필요",
        revised:
          "퇴학처분 전 절차, 진로상담, 재심 절차, 보호자 통지, 학습권 보호 방안을 명확히 규정한다.",
        reason: "학교급별 징계 가능 범위 차이 반영",
      },
    ];
  }

  return {
    schoolName: params.schoolName || "학교명 미입력",
    schoolLevel: params.schoolLevel,
    generatedAt: new Date().toISOString(),
    summary: summarize(items),
    items,
  };
}
