import SignOutButton from "@/components/SignOutButton";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  // const users = await prisma.user.findMany({
  //   orderBy: { score: "desc" },
  // });
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    orderBy: {
      score: "desc",
    },
  });

  return (
    <>
      <SignOutButton />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Player Scores</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="text-center">{u.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
