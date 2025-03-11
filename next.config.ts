import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { Redirect } from "next/dist/lib/load-custom-routes";
import { Database } from "./database.types";
import { Locale } from "./i18n/types";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    const locales: Locale[] = ["zh-TW", "en-US"];
    const roles: Database["public"]["Enums"]["app_role"][] = [
      "admin",
      "vendor",
      "customer",
    ];

    const ordersRedirect: Redirect[] = [];

    locales.forEach((locale) => {
      roles.forEach((role) => {
        ordersRedirect.push({
          source: `/${locale}/${role}/orders`,
          destination: `/${locale}/${role}/orders/pending`,
          permanent: true,
        });
      });
    });

    return [
      {
        source: "/",
        destination: "/zh-TW",
        permanent: true,
      },
      ...ordersRedirect,
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
