import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionById } from "@/lib/db.server";
import { ProblemView } from "./ProblemView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProblemPage(props: PageProps) {
  const { id } = await props.params;
  const decodedId = decodeURIComponent(id);
  const question = getQuestionById(decodedId);
  if (!question) {
    notFound();
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
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
