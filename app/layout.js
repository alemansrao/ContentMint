import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar.jsx";
export const metadata = {
  title: "Content suggestion app",
  description: "AI based content suggestion application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=" dark">
      <body
        className={`antialiased`}
      >
        <Providers>
          <Navbar/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
