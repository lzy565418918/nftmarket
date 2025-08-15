// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import "./globals.css";
import { Providers } from "./providers";
import Link from 'next/link';
import { Button } from '@heroui/button';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <body>
        <Providers>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24 }}>
            <Link href="/">
              <Button>market</Button>
            </Link>
            <Link href="/portal">
              <Button>my portal</Button>
            </Link>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}