import ClientPage from "./components/ClientPage";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    const question = decodeURIComponent(q.replace(/\+/g, " "));
    return {
      title: `LMCTFY: ${question}`,
      description: "Someone thought you should ask Claude this...",
      openGraph: {
        title: `LMCTFY: ${question}`,
        description: "Someone thought you should ask Claude this...",
      },
    };
  }
  return {
    title: "Let Me Claude That For You",
    description:
      "For all those people who find it easier to ask you than to ask Claude...",
  };
}

export default function Home() {
  return <ClientPage />;
}
