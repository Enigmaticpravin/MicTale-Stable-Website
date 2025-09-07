// app/book/kaalikh-author-signed-paperback/page.jsx
import Script from "next/script";
import BookClient from "@/app/book/BookClient";

export const dynamic = "force-static";

export const metadata = {
  title: "Kaalikh (Author-signed, Revised Edition) | Buy Online at MicTale",
  description:
    "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection. Buy the author-signed revised edition online.",
  alternates: {
    canonical:
      "https://www.mictale.in/book/kaalikh-author-signed-paperback-by-pravin-gupta",
  },
  openGraph: {
    title: "Kaalikh (Author-signed, Revised Edition) | MicTale",
    description:
      "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection. Buy the author-signed revised edition online.",
    url: "https://www.mictale.in/book/kaalikh-author-signed-paperback-by-pravin-gupta",
    images: [
      "https://res.cloudinary.com/drwvlsjzn/image/upload/v1757231888/1_hmpfd3.png",
    ],
    type: "book",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaalikh (Author-signed, Revised Edition) | MicTale",
    description:
      "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection. Buy the author-signed revised edition online.",
    images: [
      "https://res.cloudinary.com/drwvlsjzn/image/upload/v1757231888/1_hmpfd3.png",
    ],
  },
};

const book = {
  title: "Kaalikh (Author-signed, Revised Edition)",
  author: "Pravin Gupta",
  isbn: "978-9334145878",
  price: 150,
  originalPrice: 200,
  genre: "Poetry",
  releaseDate: "2024-08-30",
  pageCount: 130,
  description: `जब भी कलम और तलवार के बीच जंग होगी,
तलवार की ही जीत होगी।

कलम का हारना स्वभाविक है।

अपने समाज की परिस्तिथि भी कुछ ऐसी ही है।
यहाँ नफरत और शोर-शराबे का ही बोल-बाला है।
साहित्य हर रोज मारा जा रहा है।

पर लोककल्याण के लिए,
कलम से "कालिख" का बहना बहुत जरूरी है,
ताकि मासूमों के बदन से लहू ना बहे।

- प्रवीन गुप्ता (कालिख)

"कालिख" एक हिंदी-उर्दू काव्य संग्रह है, जिसमें नज़्म, ख्याल, ग़ज़ल और शेर शामिल हैं। यह पुस्तक प्रेम, दुःख, और जीवन की जटिलताओं के विषयों को गहराई से छूती है।`,
  inStock: true,
  bookimage:
    "https://res.cloudinary.com/drwvlsjzn/image/upload/v1757231888/1_hmpfd3.png",
  stockCount: 23,
};

export default function KaalikhPage() {
  const canonical =
    "https://www.mictale.in/book/kaalikh-author-signed-paperback-by-pravin-gupta";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    isbn: book.isbn,
    datePublished: book.releaseDate,
    genre: book.genre,
    url: canonical,
    image: book.bookimage,
    offers: {
      "@type": "Offer",
      price: String(book.price),
      priceCurrency: "INR",
      availability: book.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonical,
    },
  };

  return (
    <>
      <Script
        id="kaalikh-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookClient book={book} error={null} url={canonical} />
    </>
  );
}
