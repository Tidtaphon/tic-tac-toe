import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { result } = await req.json();
  const session = await getServerSession();

  if (!session?.user?.email) return Response.json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  let score = user!.score;
  let streak = user!.winStreak;

  if (result === "win") {
    score += 1;
    streak += 1;
    if (streak === 3) {
      score += 1;
      streak = 0;
    }
  } else if (result === "lose") {
    score -= 1;
    streak = 0;
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { score, winStreak: streak },
  });

  return Response.json({ score, streak });
}
