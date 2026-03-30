import { notFound } from "next/navigation";
import { getProgramById } from "@/lib/programs";
import ProgramDetails from "@/components/ProgramDetails";

export default async function ProgramDetailPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const program = await getProgramById(programId);
  if (!program) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <ProgramDetails program={program} />
    </main>
  );
}
