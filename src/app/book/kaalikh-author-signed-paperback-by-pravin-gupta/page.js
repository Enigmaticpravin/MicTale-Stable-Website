// app/book/kaalikh-author-signed-paperback/page.jsx
import Script from "next/script";
import BookClient from "@/app/book/BookClient";

export const dynamic = "force-static";

export const metadata = {
  title: "Kaalikh (Author-signed, Revised Edition) by Pravin Gupta | Buy Online at MicTale",
  description:
    "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection of nazms, ghazals, and kavitas. Buy the author-signed revised edition online at MicTale.",
  alternates: {
    canonical:
      "https://www.mictale.in/book/kaalikh-author-signed-paperback-by-pravin-gupta",
  },
  openGraph: {
    title: "Kaalikh (Author-signed, Revised Edition) by Pravin Gupta | MicTale",
    description:
      "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection of nazms, ghazals, and kavitas. Buy the author-signed revised edition online at MicTale.",
    url: "https://www.mictale.in/book/kaalikh-author-signed-paperback-by-pravin-gupta",
    images: [
      {
        url: "https://res.cloudinary.com/drwvlsjzn/image/upload/v1757231888/1_hmpfd3.png",
        width: 1200,
        height: 630,
        alt: "Kaalikh Book Cover",
      },
    ],
    type: "book",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaalikh (Author-signed, Revised Edition) by Pravin Gupta | MicTale",
    description:
      "Kaalikh by Pravin Gupta — a Hindi-Urdu poetry collection of nazms, ghazals, and kavitas. Buy the author-signed revised edition online at MicTale.",
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

  const jsonLdBook = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    isbn: book.isbn,
    datePublished: book.releaseDate,
    numberOfPages: book.pageCount,
    bookEdition: "Revised Edition",
    bookFormat: "https://schema.org/Paperback",
    genre: book.genre,
    url: canonical,
    image: book.bookimage,
    description: book.description,
    inLanguage: "hi",
    publisher: {
      "@type": "Organization",
      name: "MicTale",
      url: "https://www.mictale.in",
    },
    offers: {
      "@type": "Offer",
      price: String(book.price),
      priceCurrency: "INR",
      availability: book.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: canonical,
      seller: {
        "@type": "Organization",
        name: "MicTale",
      },
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.mictale.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: book.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <Script
        id="kaalikh-jsonld-book"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBook) }}
      />
      <Script
        id="kaalikh-jsonld-breadcrumbs"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <BookClient book={book} error={null} url={canonical} />
    </>
  );
}
