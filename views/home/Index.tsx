'use client'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import { useRouter } from 'next/navigation';
import NFTCollection from '@/engine/NFTCollection.json'
import Resell from '@/engine/Resell.json';
import { Button, Spacer, Image as HeroImage } from '@heroui/react';
import { hhresell, hhnftcol, mainnet } from '@/engine/configuration';
import { cipherHH, simpleCrypto } from '@/engine/configuration';
import confetti from 'canvas-confetti';
import 'sf-font';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { NftItem } from '@/utils/types'

export default function Home() {
  const [hhlist, hhResellNfts] = useState<NftItem[]>([])
  useEffect(() => {
    loadHardHatResell()
  })
  const router = useRouter()

  const loadHardHatResell = async () => {
    const provider = new ethers.JsonRpcProvider(mainnet)
    const key = simpleCrypto.decrypt(cipherHH) as string
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
    const market = new ethers.Contract(hhresell, Resell, wallet);
    const itemArray: NftItem[] = [];
    const result = await contract.totalSupply()
    for (let i = 0; i < result; i++) {
      const tokenId = i + 1
      const owner = await contract.ownerOf(tokenId)
      if (owner == hhresell) {
        const rawUri = await contract.tokenURI(tokenId)
        const res = await fetch(rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
        const data = await res.json()
        const { image,
          name,
          description: desc,
        } = data
        const img = image.replace('ipfs://', 'https://ipfs.io/ipfs/')
        const price = await market.getPrice(tokenId)
        const cost = Number(price).toString()
        const val = ethers.formatUnits(cost, 'ether')
        const meta = {
          name,
          img,
          cost,
          val,
          tokenId,
          wallet: owner,
          desc
        }
        console.log(meta)
        itemArray.push(meta)
      }
      await new Promise(r => setTimeout(r, 3000));
    }
    hhResellNfts(itemArray)


    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
      }
    };

    return (
      <div>
        <div>
          <div className="w-full" style={{ backgroundImage: 'linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)' }}>
            <div className="mb-6 max-w-[1200px] mx-auto">
              <h2 className="ml-40 text-white text-2xl font-bold">Top Collections</h2>
              <Carousel swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={6000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={800}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-60-px">
                {
                  hhlist.map((nft, i) => (
                    <div key={i} className="flex justify-center items-center">
                      <HeroImage className="ml-16 max-w-[450px] rounded-xl" src={nft.img} alt={nft.name || 'NFT'} />
                    </div>
                  ))
                }
              </Carousel>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-6 mb-6 px-4">
          <div className="mt-6 mb-6">
            <h3 className="text-[1.5rem] font-bold text-[#222]">Latest NFT&apos;s</h3>
          </div>
          <div className="flex flex-wrap gap-6">
            {
              hhlist.slice(0, 9).map((nft, id) => {
                async function buylistNft() {
                  const web3Modal = new Web3Modal()
                  const connection = await web3Modal.connect()
                  const provider = new ethers.BrowserProvider(connection)
                  const signer = await provider.getSigner()
                  const contract = new ethers.Contract(hhresell, Resell, signer)
                  const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
                  await transaction.wait()
                  router.push('/portal')
                }
                return (
                  <div key={id} className="w-1/3 min-w-[260px] bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                    <div className="text-black font-bold font-sans text-[20px] mb-2">{nft.name} Token-{nft.tokenId}</div>
                    <HeroImage className="max-w-[150px] rounded-lg mb-2" src={nft.img} alt={nft.name || 'NFT'} />
                    <div className="text-[#666] text-[15px] mb-2 text-left w-full">{nft.desc}</div>
                    <div className="text-[30px] text-[#9D00FF] font-bold mb-2 flex items-center">{nft.val} <HeroImage src='n2dr-logo.png' alt="logo" className="w-[60px] h-[25px] mt-1 ml-2" /></div>
                    <Button color="secondary" className="text-[20px] w-full" onPress={() => {
                      buylistNft()
                      confetti();
                    }}>Buy</Button>
                  </div>
                )
              })
            }
          </div>
        </div>
        <Spacer></Spacer>
      </div>
    )
  }
}