import React from "react";
import { notFound } from "next/navigation";
import { getPoemBySlug } from "@/app/lib/poems";
import PoemPageClient from "./PoemPageClient";
import Script from "next/script";
import { fetchSimilarPoems } from "@/app/lib/database";

export const revalidate = 60;

export async function generateMetadata({ params }) {
 const resolvedParams = await params;
  const { slug } = resolvedParams;
  const poem = await getPoemBySlug(slug);
  if (!poem) return { title: "Poem not found" };

  const title = `${poem.title} by ${poem.author} | ${poem.category}`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/poem/${slug}`;
  const description = `${poem.title} by ${poem.author} | Read full poem at MicTale`;

  return {
    title,
    description,
    alternates: { canonical: url },
    other: {
      description: description,
    },
    keywords: [
      poem.title,
      poem.author,
      poem.category,
      `${poem.title} ${poem.author}`,
      `${poem.author} poetry`,
      `${poem.category} poem`,
    ],
    authors: [{ name: poem.author }],
    robots: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "MicTale",
      authors: [poem.author],
      publishedTime: poem.createdAt || undefined,
      images: [
        {
          url: "https://i.imgur.com/YFpScQU.png",
          width: 1200,
          height: 630,
          alt: `${poem.title} by ${poem.author}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: "https://i.imgur.com/YFpScQU.png",
    },
  };
}

function buildShersFromContent(content = "") {
  if (!content) return [];
  const raw = content
    .split(/।\s*|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const shers = [];
  for (let i = 0; i < raw.length; i += 2) {
    const first = raw[i] || "";
    const second = raw[i + 1] || "";
    shers.push({ first, second });
  }
  return shers;
}

export default async function PoemPage({ params }) {
  const { slug } = params;
  const poem = await getPoemBySlug(slug);
  if (!poem) notFound();

  const title = poem.title || "";
  const author = poem.author || poem.poet || "";
  const category = (poem.category || "").toString();
  const content =
    typeof poem.content === "string" && poem.content
      ? poem.content
      : Array.isArray(poem.lines)
      ? poem.lines.join("\n")
      : "";
  const isGhazal = category.toLowerCase().includes("ghazal");
  const shers = isGhazal ? buildShersFromContent(content) : [];

  const similar = await fetchSimilarPoems({
    author,
    category,
    excludeSlug: slug,
    limit: 4,
  });

  return (
    <>
      <PoemPageClient
        poem={{
          title,
          author,
          category,
          content,
          isGhazal,
          shers,
        }}
        similar={similar}
      />
      <Script id="ld-json" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Poem",
          name: title,
          author: {
            "@type": "Person",
            name: author,
          },
          genre: category,
          inLanguage: "hi",
          datePublished: poem.createdAt || "",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/poem/${slug}`,
          publisher: {
            "@type": "Organization",
            name: "MicTale",
            url: process.env.NEXT_PUBLIC_BASE_URL,
          },
          text: content,
        })}
      </Script>
    </>
  );
}
