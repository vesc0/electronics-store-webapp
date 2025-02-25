import './globals.css';
import { CartProvider } from './context/CartContext';

export const metadata = {
  title: 'ELECTRONICS STORE',
  description: 'An online electroncics store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <main className="flex-grow">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}