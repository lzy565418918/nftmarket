'use client' // Next.js 客户端组件声明
import { ethers } from 'ethers'; // ethers.js 用于与以太坊交互
import { useEffect, useState } from 'react'; // React 状态和生命周期钩子
import Web3Modal from "web3modal"; // 钱包连接弹窗库
import { useRouter } from 'next/navigation'; // Next.js 路由跳转
import NFTCollection from '@/engine/NFTCollection.json' // NFTCollection 合约 ABI
import Resell from '@/engine/Resell.json'; // Resell 合约 ABI
import { Button, Spacer, Image as HeroImage, Spinner } from '@heroui/react'; // heroui 组件库
import { hhresell, hhnftcol, mainnet } from '@/engine/configuration'; // 合约地址和网络配置
import { cipherHH, simpleCrypto } from '@/engine/configuration'; // 加密配置
import confetti from 'canvas-confetti'; // 彩带动画库
import 'sf-font'; // 字体库（未启用）
import Carousel from "react-multi-carousel"; // 轮播图组件
import "react-multi-carousel/lib/styles.css"; // 轮播图样式
import { NftItem } from '@/utils/types' // NFT 数据类型

// 首页主组件
export default function Home() {
  const [hhlist, hhResellNfts] = useState<NftItem[]>([]) // NFT 列表
  const [loading, setLoading] = useState(true) // 加载状态
  useEffect(() => {
    loadHardHatResell() // 页面加载时获取NFT列表
  }, []) // 只在首次渲染时执行
  const router = useRouter() // 路由跳转实例

  // 获取HardHat链上的Resell NFT列表
  const loadHardHatResell = async () => {
    setLoading(true)
    const provider = new ethers.JsonRpcProvider(mainnet) // 创建RPC提供者
    const key = simpleCrypto.decrypt(cipherHH) as string // 解密私钥
    const wallet = new ethers.Wallet(key, provider); // 创建钱包实例
    const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet); // NFTCollection合约实例
    const market = new ethers.Contract(hhresell, Resell, wallet); // Resell市场合约实例
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
    setLoading(false)
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
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="gradient-text text-4xl md:text-5xl font-bold mb-4">
                Discover Unique NFTs
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore, collect, and trade extraordinary digital art from creators worldwide
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="lg" color="secondary" />
                <p className="text-gray-400 mt-4">Loading NFTs...</p>
              </div>
            ) : hhlist.length > 0 ? (
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                customTransition="transform 500ms ease-in-out"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="px-4"
              >
                {hhlist.map((nft, i) => (
                  <div key={i} className="flex justify-center items-center py-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <HeroImage
                        className="relative max-w-[400px] max-h-[400px] rounded-2xl object-cover"
                        src={nft.img}
                        alt={nft.name || 'NFT'}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No NFTs available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NFT Grid Section */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Latest NFTs</h2>
            <p className="text-gray-400">Discover the newest additions to our marketplace</p>
          </div>
          <div className="hidden md:block">
            <span className="text-purple-400 font-semibold">{hhlist.length} items</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" color="secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hhlist.slice(0, 9).map((nft, id) => {
              // 购买NFT函数
              async function buylistNft() {
                const web3Modal = new Web3Modal() // 创建钱包弹窗
                const connection = await web3Modal.connect() // 连接钱包
                const provider = new ethers.BrowserProvider(connection) // 创建provider
                const signer = await provider.getSigner() // 获取签名者
                const contract = new ethers.Contract(hhresell, Resell, signer) // Resell合约实例
                const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost }) // 购买NFT
                await transaction.wait() // 等待交易完成
                router.push('/portal') // 跳转到portal页面
              }
              return (
                <div
                  key={id}
                  className="nft-card rounded-2xl p-5 flex flex-col"
                >
                  {/* NFT 图片 */}
                  <div className="relative mb-4 rounded-xl overflow-hidden group">
                    <HeroImage
                      className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-110"
                      src={nft.img}
                      alt={nft.name || 'NFT'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* NFT 信息 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-lg truncate">{nft.name}</h3>
                      <span className="text-purple-400 text-sm font-mono">#{nft.tokenId}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{nft.desc}</p>
                  </div>

                  {/* 价格和购买按钮 */}
                  <div className="border-t border-purple-500/20 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Price</p>
                        <p className="gradient-text text-xl font-bold">{nft.val} ETH</p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold px-6 hover:opacity-90 transition-all hover:scale-105"
                        onPress={() => {
                          buylistNft()
                          confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                          })
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Spacer y={8} />
    </div>
  )
}