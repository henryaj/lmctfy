import InputForm from "./components/InputForm";
import Animation from "./components/Animation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

function decodeQuery(q: string): string {
  return decodeURIComponent(q.replace(/\+/g, " "));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Let Me Claude That For You",
    description:
      "For all those people who find it easier to ask you than to ask Claude...",
  };
}

export default async function Home({ searchParams }: Props) {
  const { q } = await searchParams;
  const question = q ? decodeQuery(q) : null;

  if (question) {
    return <Animation question={question} />;
  }

  return <InputForm />;
}
