'use client' // Next.js 客户端组件声明
import { ethers } from 'ethers'; // ethers.js 用于与以太坊交互
import { useEffect, useState } from 'react'; // React 状态和生命周期钩子
import Web3Modal from "web3modal"; // 钱包连接弹窗库
import { useRouter } from 'next/navigation'; // Next.js 路由跳转
import { NFTMarketResell, Collection, NFT, Market } from '@/abis' // NFTCollection 合约 ABI
import { Button, Spacer, Image as HeroImage } from '@heroui/react'; // heroui 组件库
import { hhnft, hhmarket, hhresell, hhnftcol, mainnet } from '@/engine/configuration'; // 合约地址和网络配置
import { cipherHH, simpleCrypto } from '@/engine/configuration'; // 加密配置
import confetti from 'canvas-confetti'; // 彩带动画库
import 'sf-font'; // 字体库（未启用）
import Carousel from "react-multi-carousel"; // 轮播图组件
import "react-multi-carousel/lib/styles.css"; // 轮播图样式
import { NftItem } from '@/utils/types' // NFT 数据类型

// 首页主组件
export default function Home() {
  const [hhlist, hhResellNfts] = useState<NftItem[]>([]) // NFT 列表
  const [hhnfts, hhsetNfts] = useState<(NftItem & { price: string })[]>([]) // NFT 列表
  useEffect(() => {
    loadHardHatResell() // 页面加载时获取NFT列表
    loadNewSaleNFTs()
  }, []) // 只在首次渲染时执行
  const router = useRouter() // 路由跳转实例

  // 获取HardHat链上的Resell NFT列表
  const loadHardHatResell = async () => {
    const provider = new ethers.JsonRpcProvider(mainnet) // 创建RPC提供者
    const key = simpleCrypto.decrypt(cipherHH) as string // 解密私钥
    const wallet = new ethers.Wallet(key, provider); // 创建钱包实例
    const contract = new ethers.Contract(hhnftcol, Collection, wallet); // NFTCollection合约实例
    const market = new ethers.Contract(hhresell, NFTMarketResell, wallet); // Resell市场合约实例
    const itemArray: NftItem[] = []; // NFT数据临时数组
    const result = await contract.totalSupply() // 获取NFT总数
    for (let i = 0; i < result; i++) { // 遍历所有NFT
      const tokenId = i + 1 // tokenId从1开始
      const owner = await contract.ownerOf(tokenId) // 获取NFT持有者
      if (owner == hhresell) { // 只筛选已上架到市场的NFT
        const rawUri = await contract.tokenURI(tokenId) // 获取元数据URI
        const res = await fetch(rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/')) // 获取元数据内容
        const data = await res.json() // 解析JSON
        const { image, name, description: desc } = data // 解构元数据
        const img = image.replace('ipfs://', 'https://ipfs.io/ipfs/') // 格式化图片链接
        const price = await market.getPrice(tokenId) // 获取NFT价格
        const cost = Number(price).toString() // 转为字符串
        const val = ethers.formatUnits(cost, 'ether') // 格式化为ETH单位
        const meta = {
          name, // NFT名称
          img, // NFT图片
          cost, // 价格（wei）
          val, // 价格（ETH）
          tokenId, // NFT编号
          wallet: owner, // 持有者
          desc // 描述
        }
        console.log(meta) // 打印元数据
        itemArray.push(meta) // 添加到数组
      }
      await new Promise(r => setTimeout(r, 3000)); // 等待3秒（模拟加载）
    }
    hhResellNfts(itemArray) // 设置NFT列表
  }
  const loadNewSaleNFTs = async () => {
    const hhPrivkey = simpleCrypto.decrypt(cipherHH) as string
    const provider = new ethers.JsonRpcProvider(mainnet)
    const wallet = new ethers.Wallet(hhPrivkey, provider);
    const tokenContract = new ethers.Contract(hhnft, NFT, wallet)
    const marketContract = new ethers.Contract(hhmarket, Market, wallet)
    const data = await marketContract.getAvailableNft()
    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const res = await fetch(tokenUri)
      const { image, name, description, } = await res.json()
      let price = ethers.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId,
        seller: i.seller,
        owner: i.owner,
        img: image,
        name: name,
        description: description,
      }
      return item
    }))
    hhsetNfts(items)
  }

  const buyNewNft = async (nft: NftItem & { price: string }) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.BrowserProvider(connection)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(hhmarket, Market, signer)
    const price = ethers.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.n2DMarketSale(hhnft, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNewSaleNFTs()
  }

  // 轮播图响应式配置
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
  // 页面渲染
  return (
    <div>
      <div>
        <div className="w-full" style={{ backgroundImage: 'linear-gradient(to top, #020202, #050505, #080808, #0b0b0b, #0e0e0e, #16141a, #1e1724, #291a2d, #451a3a, #64133c, #820334, #9b0022)' }}>
          <div className="mb-6 max-w-[1200px] mx-auto">
            <h2 className="ml-40 text-white text-2xl font-bold">Top Collections</h2> {/* 顶部标题 */}
            <Carousel
              swipeable={false}
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
              itemClass="carousel-item-padding-60-px"
            >
              {/* 轮播展示所有NFT图片 */}
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
          <h3 className="text-[1.5rem] font-bold text-[#222]">Latest NFT&apos;s</h3> {/* 最新NFT标题 */}
        </div>
        <div className="flex flex-wrap gap-6">
          {
            hhlist.slice(0, 9).map((nft, id) => {
              // 购买NFT函数
              async function buylistNft() {
                const web3Modal = new Web3Modal() // 创建钱包弹窗
                const connection = await web3Modal.connect() // 连接钱包
                const provider = new ethers.BrowserProvider(connection) // 创建provider
                const signer = await provider.getSigner() // 获取签名者
                const contract = new ethers.Contract(hhresell, NFTMarketResell, signer) // Resell合约实例
                const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost }) // 购买NFT
                await transaction.wait() // 等待交易完成
                router.push('/portal') // 跳转到portal页面
              }
              return (
                <div key={id} className="w-1/3 min-w-[260px] bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                  <div className="text-black font-bold font-sans text-[20px] mb-2">{nft.name} Token-{nft.tokenId}</div> {/* NFT名称和编号 */}
                  <HeroImage className="max-w-[150px] rounded-lg mb-2" src={nft.img} alt={nft.name || 'NFT'} /> {/* NFT图片 */}
                  <div className="text-[#666] text-[15px] mb-2 text-left w-full">{nft.desc}</div> {/* NFT描述 */}
                  <div className="text-[30px] bg-gradient-to-r from-[#922DFC] to-[#12DED2] font-bold bg-gradient-to-right bg-clip-text text-transparent mb-2 flex items-center">{nft.val} ETH</div> {/* NFT价格 */}
                  <Button color="secondary" className="text-[20px] w-full" onPress={() => {
                    buylistNft() // 购买NFT
                    confetti(); // 播放彩带动画
                  }}>Buy</Button>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-6 mb-6 px-4">
        <div className="mt-6 mb-6">
          <h3 className="text-[1.5rem] font-bold text-[#222]">Latest NFT&apos;s on Ethereum</h3> {/* 最新NFT标题 */}
        </div>
        <div className="flex flex-wrap gap-6">
          {
            hhnfts.slice(0, 9).map((nft, id) => {
              return (
                <div key={id} className="w-1/3 min-w-[260px] bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                  <div className="text-black font-bold font-sans text-[20px] mb-2">{nft.name} Token-{nft.tokenId}</div> {/* NFT名称和编号 */}
                  <HeroImage className="max-w-[150px] rounded-lg mb-2" src={nft.img} alt={nft.name || 'NFT'} /> {/* NFT图片 */}
                  <div className="text-[#666] text-[15px] mb-2 text-left w-full">{nft.desc}</div> {/* NFT描述 */}
                  <div className="text-[30px] bg-gradient-to-r from-[#922DFC] to-[#12DED2] font-bold bg-gradient-to-right bg-clip-text text-transparent mb-2 flex items-center">{nft.val} ETH</div> {/* NFT价格 */}
                  <Button color="secondary" className="text-[20px] w-full" onPress={() => {
                    buyNewNft(nft) // 购买NFT
                    confetti(); // 播放彩带动画
                  }}>Buy</Button>
                </div>
              )
            })
          }
        </div>
      </div>
      <Spacer></Spacer> {/* 页面底部间距 */}
    </div>
  )
}