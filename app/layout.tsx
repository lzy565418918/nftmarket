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
          <nav className="navbar sticky top-0 z-50 px-6 py-4">
            <div className="max-w-[1200px] mx-auto flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="gradient-text text-2xl font-bold">NFT Market</span>
              </Link>
              <div className="flex gap-4">
                <Link href="/">
                  <Button
                    variant="flat"
                    className="text-white hover:bg-purple-500/20 transition-all"
                  >
                    Marketplace
                  </Button>
                </Link>
                <Link href="/portal">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition-all"
                  >
                    My Portal
                  </Button>
                </Link>
                <ConnectChain />
              </div>
            </div>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}