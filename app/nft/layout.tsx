'use client'
import Link from 'next/link';
import { Button } from '@heroui/button';

const NftLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24 }}>
        <Link href="/nft/market">
          <Button>market</Button>
        </Link>
        <Link href="/nft/myPortal">
          <Button>my portal</Button>
        </Link>
      </div>
      {children}
    </>
  );
};

export default NftLayout;
