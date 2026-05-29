"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Excluir este post?")) return;

    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      router.refresh(); // recarrega a lista sem perder o estado
    } else {
      alert("Erro ao excluir o post.");
    }
  }

  return (
    <button onClick={handleDelete}>
      Excluir
    </button>
  );
}