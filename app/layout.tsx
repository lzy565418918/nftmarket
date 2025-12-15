// app/layout.tsx

// globals.css includes @tailwind directives
// adjust the path if necessary
import { Providers } from "./providers";
import Link from 'next/link';
import { Button } from '@heroui/react';
import ConnectChain from '@/engine/connectchain'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <body>
        <Providers>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24 }}>
            <Link href="/">
              <Button color="primary">market</Button>
            </Link>
            <Link href="/create">
              <Button color="primary">create portal</Button>
            </Link>
            <Link href="/portal">
              <Button color="primary">my portal</Button>
            </Link>
            <ConnectChain />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}