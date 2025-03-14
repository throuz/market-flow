"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";

export default function Hero() {
  const t = useTranslations();
  return (
    <section className="flex flex-col items-center justify-center text-center py-48">
      <h1 className="text-4xl font-bold mb-6">{t("Welcome to")} Market Flow</h1>
      <p className="text-xl mb-8">
        {t("Find the freshest vegetables and fruits for your kitchen")}
      </p>
      <Link
        href="/products"
        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        {t("Browse Products")}
      </Link>
    </section>
  );
}
