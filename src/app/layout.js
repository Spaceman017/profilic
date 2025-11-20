// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Profilic",
  description: "Automatically create and customize your professional portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
