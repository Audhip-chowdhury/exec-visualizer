import { getAllQuestions, countByTagFromDb } from "@/lib/db.server";
import { QuestionList } from "@/components/QuestionList";

export default function Home() {
  const questions = getAllQuestions();
  const tagCountsMap = countByTagFromDb();
  const tagCounts = Object.fromEntries(tagCountsMap);

  return <QuestionList questions={questions} tagCounts={tagCounts} />;
}
