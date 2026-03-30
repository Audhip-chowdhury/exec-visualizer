import Link from "next/link";
import { notFound } from "next/navigation";
import { QUESTION_BY_ID } from "@/lib/questions";
import { ProblemView } from "./ProblemView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProblemPage(props: PageProps) {
  const { id } = await props.params;
  const decodedId = decodeURIComponent(id);
  const question = QUESTION_BY_ID[decodedId];
  if (!question) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <nav className="flex shrink-0 items-center gap-3 border-b border-zinc-800 px-4 py-2 text-sm">
        <Link
          href="/"
          className="text-zinc-400 hover:text-zinc-200"
        >
          ← All problems
        </Link>
      </nav>
      <ProblemView question={question} />
    </div>
  );
}
