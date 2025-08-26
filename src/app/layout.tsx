import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SOLUTION TECH - Chat Empresarial",
  description: "Aplicación de chat empresarial para consultas sobre SOLUTION TECH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var key = 'solution-tech-chat-preferences';
                  var item = localStorage.getItem(key);
                  var theme = 'light';
                  if (item) {
                    var parsed = JSON.parse(item);
                    theme = parsed && parsed.theme ? parsed.theme : 'light';
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = 'dark';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
