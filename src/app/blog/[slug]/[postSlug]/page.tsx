import db from "../../../../lib/db";

interface Post {
  title: string;
  content: string;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string; postSlug: string };
}) {
  const post = db
    .prepare(
      "SELECT title, content FROM posts WHERE slug = ? AND status = 'published'"
    )
    .get(params.postSlug) as Post | undefined;

  if (!post) {
    return <div className="p-8">Post não encontrado</div>;
  }

  return (
    <article className="prose mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
