"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import InputForm from "./InputForm";
import Animation from "./Animation";

function PageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const question = q ? q : null;

  if (question) {
    return <Animation question={question} />;
  }

  return <InputForm />;
}

export default function ClientPage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
