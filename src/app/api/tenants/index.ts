import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, slug } = await req.json();

  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      // ❌ removido primary_color, só use se existir no schema
    },
  });

  return NextResponse.json(tenant);
}

export async function GET() {
  const tenants = await prisma.tenant.findMany();
  return NextResponse.json(tenants);
}
