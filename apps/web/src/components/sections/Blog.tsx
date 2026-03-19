"use client";

import { motion } from "framer-motion";

const posts = [
  {
    title: "In BTC We Trust: The Elon Musk Effect on a US Backed Stablecoin",
    author: "SupItsJ",
    date: "5 JAN 2025",
    excerpt: "How macro crypto narratives are shifting reload opportunity windows across major platforms.",
    href: "#blog",
  },
  {
    title: "The Art of Affiliate Whoring",
    author: "SupItsJ",
    date: "29 NOV 2024",
    excerpt: "A tactical breakdown of stacking affiliate commission across competing reload ecosystems.",
    href: "#blog",
  },
  {
    title: "How Telegram & TON Could Revolutionize Advertising Networks in Social Media",
    author: "SupItsJ",
    date: "4 JUL 2024",
    excerpt: "The next distribution layer for reload services is already here — and most aren't using it.",
    href: "#blog",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="px-4 sm:px-10 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading">From the Blog</h2>
          <p className="section-subheading">Intelligence from the team behind the system.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card card-hover group block"
            >
              <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "var(--brand-muted)" }}>
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-bold text-base leading-snug group-hover:text-white transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-muted)" }}>
                {post.excerpt}
              </p>
              <div className="mt-4 text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
                Read more →
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
