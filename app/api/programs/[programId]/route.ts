import {
  PORTFOLIO_API_DELAY_MS,
  authorizeProgramEditor,
  getProgramById,
  parseProgramMetadataUpdate,
  updateProgramMetadata,
} from "@/lib/programs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ programId: string }> }) {
  const { programId } = await context.params;
  const program = await getProgramById(programId, {
    delayMs: PORTFOLIO_API_DELAY_MS,
  });

  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  return NextResponse.json(program, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ programId: string }> }) {
  if (!authorizeProgramEditor(request)) {
    return NextResponse.json(
      { error: "Your simulated role does not have permission to edit metadata." },
      { status: 401 },
    );
  }

  const { programId } = await context.params;
  const existingProgram = await getProgramById(programId);

  if (!existingProgram) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const metadata = parseProgramMetadataUpdate(payload?.metadata);

  if (!metadata) {
    return NextResponse.json(
      { error: "Only indication, lead, risk level, and priority metadata can be updated." },
      { status: 400 },
    );
  }

  const updated = await updateProgramMetadata(existingProgram.id, metadata, {
    delayMs: PORTFOLIO_API_DELAY_MS,
  });

  if (!updated) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  return NextResponse.json(updated, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
