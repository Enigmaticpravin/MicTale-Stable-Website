// app/book/he-is-a-hero-he-raped/page.jsx
import BookClient from '@/app/book/BookClient'

export const metadata = {
  title: 'He is a Hero. He Raped! | Buy Online at MicTale',
  description: `He is a Hero. He Raped! by Anubhav Singh — fiction novel. Buy online.`,
  alternates: { canonical: 'https://www.mictale.in/book/he-is-a-hero-he-raped' },
  openGraph: {
    title: 'He is a Hero. He Raped! | MicTale',
    description: 'He is a Hero. He Raped! by Anubhav Singh — fiction novel. Buy online.',
    url: 'https://www.mictale.in/book/he-is-a-hero-he-raped',
    images: ['https://firebasestorage.googleapis.com/v0/b/cord-60823.appspot.com/o/Open%20Graph.png?alt=media'],
    type: 'book'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'He is a Hero. He Raped! | MicTale',
    description: 'He is a Hero. He Raped! by Anubhav Singh — fiction novel. Buy online.',
    images: ['https://firebasestorage.googleapis.com/v0/b/cord-60823.appspot.com/o/Open%20Graph.png?alt=media']
  }
}

const book = {
  title: 'He is a Hero. He Raped!',
  author: 'Anubhav Singh',
  isbn: '978-93-342-2993-6',
  price: 199,
  originalPrice: 250,
  genre: 'Fiction',
  releaseDate: '2025-03-09',
  pageCount: 229,
  description:
    'Set in the fictitious village of Uttar Pradesh - Devpura, the lives of several individuals are turned upside down by a bizarre incident. The story focuses on 19-year-old Ashoka as he navigates adulthood and the complexities of relationships with his family and friends. The narrative takes a dark turn when his cousin Padma is abducted and assaulted by a powerful figure in their village. While others come to terms with the situation, Ashoka, with the help of his allies, decides to bravely fights against the crime. As the narrative unfolds, the novel delves into the themes of familial relationships, complex friendships, platonic love, societal norms and evilness.',
  inStock: true,
  bookimage: 'https://firebasestorage.googleapis.com/v0/b/cord-60823.appspot.com/o/Open%20Graph.png?alt=media ',
  stockCount: 18
}

export default function HeroBookPage() {
  const canonical = 'https://www.mictale.in/book/he-is-a-hero-he-raped-by-anubhav-singh'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: book.author },
    isbn: book.isbn,
    datePublished: book.releaseDate,
    genre: book.genre,
    url: canonical,
    image: book.bookimage,
    offers: {
      '@type': 'Offer',
      price: String(book.price),
      priceCurrency: 'INR',
      availability: book.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonical
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookClient book={book} error={null} url={canonical} />
    </>
  )
}
