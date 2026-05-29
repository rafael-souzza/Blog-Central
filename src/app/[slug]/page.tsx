import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type TenantWithPosts = Prisma.TenantGetPayload<{
  include: { posts: true };
}>;

export default async function TenantPage({ params }: { params: { slug: string } }) {
  const tenant: TenantWithPosts | null = await prisma.tenant.findUnique({
    where: { slug: params.slug },
    include: { posts: true },
  });

  if (!tenant) return <div>Tenant não encontrado</div>;

  return (
    <div>
      <h1>{tenant.name}</h1>
      <h2>Posts:</h2>
      <ul>
        {tenant.posts.map((post: TenantWithPosts["posts"][number]) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
