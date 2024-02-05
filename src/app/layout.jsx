import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "@/context/ToasterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DEVOPS HISPAM",
  description: "Metricas de Madurez y Dora",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext />
        {children}
      </body>
    </html>
  );
}
