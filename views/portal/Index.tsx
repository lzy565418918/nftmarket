'use client' // Next.js 客户端组件声明

import { ethers } from 'ethers'; // ethers.js 用于与以太坊交互
import { useState, useEffect } from 'react'; // React 状态和生命周期钩子
import Web3Modal from 'web3modal'; // 钱包连接弹窗库
import { useRouter } from 'next/navigation'; // Next.js 路由跳转
import Image from 'next/image'; // Next.js 图片优化组件
import Resell from '@/engine/Resell.json'; // Resell 合约 ABI
import NFTCollection from '@/engine/NFTCollection.json'; // NFTCollection 合约 ABI
import 'sf-font'; // 字体库（未启用）
import Web3 from 'web3'; // web3.js 用于钱包账户获取
import { hhresell, hhnftcol, mainnet, cipherHH, simpleCrypto } from '@/engine/configuration'; // 合约地址和加密配置
import { NftItem } from '@/utils/types'
// 主组件
export default function Sell() {
  const [user, setUser] = useState(''); // 当前钱包地址
  const [resalePrice, updateresalePrice] = useState({ price: '' }); // 重新上架价格
  const [nfts, setNfts] = useState<NftItem[]>([]); // NFT 列表
  const [loading, setloading] = useState(false); // 加载状态
  useEffect(() => {
    connectUser(); // 页面加载时连接钱包
  }, []); // 只在首次渲染时执行

  const router = useRouter(); // 路由跳转实例

  // 连接钱包并获取当前账户
  const connectUser = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum); // 创建 web3 实例
      // await window.ethereum.send('eth_requestAccounts'); // 请求钱包授权（已废弃）
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // 推荐用法
      const accounts = await web3.eth.getAccounts(); // 获取钱包地址列表
      const account = accounts[0]; // 取第一个地址
      setUser(account); // 设置当前用户
      getWalletNFTs(); // 获取钱包内 NFT
    }
  }

  // 获取钱包内所有 NFT 信息
  const getWalletNFTs = async () => {
    // debugger // 调试断点
    setloading(true); // 开始加载

    try {
      const provider = new ethers.JsonRpcProvider(mainnet); // 创建 RPC 提供者
      const key = simpleCrypto.decrypt(cipherHH); // 解密私钥
      const wallet = new ethers.Wallet(key as string, provider); // 创建钱包实例
      const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet); // NFTCollection 合约实例
      console.log('Contract:', contract);
      const itemArray: Array<NftItem> = []; // NFT 数据临时数组
      const result = await contract.totalSupply(); // 获取 NFT 总数
      const totalSup = Number(result); // 转为数字
      console.log('Total Supply:', totalSup);
      for (let i = 0; i < totalSup; i++) {
        const token = i + 1; // tokenId 从 1 开始
        const owner = await contract.ownerOf(token).catch(function (error) {
          console.log('tokens filtered:', error); // 获取持有者失败处理
        });
        const rawUri = await contract.tokenURI(token).catch(function (error) {
          console.log('tokens filtered:', error); // 获取元数据链接失败处理
        });
        console.log('owner:', owner);
        console.log('rawUri:', rawUri);
        const response = await fetch(rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/')); // 获取元数据
        const data = await response.json(); // 解析 JSON
        if (!data) throw new Error('Failed to fetch metadata'); // 元数据获取失败
        console.log('data:', data)
        const { image, name, description } = data; // 解构元数据
        const meta = {
          name: name, // NFT 名称
          img: image.replace('ipfs://', 'https://ipfs.io/ipfs/'), // 图片链接格式化
          tokenId: token, // NFT 编号
          wallet: owner, // 持有者地址
          desc: description, // NFT 描述
        };
        console.log(meta);
        itemArray.push(meta); // 添加到数组
      }
      await new Promise(r => setTimeout(r, 3000)); // 等待3秒（模拟加载）
      setNfts(itemArray); // 设置 NFT 列表
    } catch (error) {
      console.log('Error fetching NFTs:', error); // 错误处理
    } finally {
      setloading(false); // 加载结束
    }
  }

  // 加载中且没有 NFT 时显示提示
  if (loading && !nfts.length)
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
        <h3 style={{ color: '#888', marginBottom: 16 }}>未找到NFT，请连接钱包</h3>
      </div>
    );
  // 主渲染区域
  return (
    <div className="max-w-[900px] mx-auto my-10 p-6">
      <div className="mb-6">
        <h4 className="mb-2">钱包中的NFT</h4> {/* 标题 */}
        <div className="text-[#39FF14] font-bold mb-4">{user}</div> {/* 当前钱包地址 */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={connectUser}
            className="px-4 py-1.5 rounded border border-[#39FF14] bg-white text-[#39FF14] cursor-pointer"
          >
            刷新钱包
          </button>
          <button
            onClick={getWalletNFTs}
            className="px-4 py-1.5 rounded border border-[#9D00FF] bg-white text-[#9D00FF] cursor-pointer"
          >
            刷新NFT
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {loading ? (
          // 加载时显示骨架屏
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="animate-pulse w-[180px] bg-white rounded p-2 border border-[#eee]">
              <div className="w-full h-[180px] bg-gray-200 rounded mb-3" /> {/* 图片骨架 */}
              <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" /> {/* 标题骨架 */}
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" /> {/* 名称骨架 */}
              <div className="h-3 w-2/3 bg-gray-200 rounded mb-2" /> {/* 描述骨架 */}
              <div className="h-8 w-full bg-gray-200 rounded" /> {/* 按钮骨架 */}
            </div>
          ))
        ) : (
          nfts.map((nft, i) => {
            const owner = user;
            if (owner.indexOf(nft.wallet) !== -1) {
              // 重新上架按钮点击事件
              async function executeRelist() {
                const { price } = resalePrice;
                if (!price) return;
                try {
                  relistNFT();
                } catch (error) {
                  console.log('Transaction Failed', error);
                }
              }
              // 重新上架 NFT 的逻辑
              async function relistNFT() {
                const web3Modal = new Web3Modal(); // 创建钱包弹窗
                const connection = await web3Modal.connect(); // 连接钱包
                const provider = new ethers.BrowserProvider(connection); // 创建 provider
                const signer = await provider.getSigner(); // 获取签名者
                const price = ethers.parseUnits(resalePrice.price, 'ether'); // 价格转为 wei
                const contractnft = new ethers.Contract(hhnftcol, NFTCollection, signer); // NFTCollection 合约实例
                await contractnft.setApprovalForAll(hhresell, true); // 授权市场合约
                const contract = new ethers.Contract(hhresell, Resell, signer); // Resell 合约实例
                const listingFee = (await contract.getListingFee()).toString(); // 获取上架手续费
                const transaction = await contract.listSale(nft.tokenId, price, { value: listingFee }); // 上架 NFT
                await transaction.wait(); // 等待交易完成
                router.push('/'); // 跳转首页
              }
              return (
                <div key={i}>
                  <Image
                    src={nft.img}
                    alt={nft.name}
                    width={180}
                    height={180}
                    className="w-[180px] h-[180px] object-cover rounded mb-3"
                    unoptimized
                  /> {/* NFT 图片 */}
                  <h3 className="text-[#9D00FF] font-sans text-lg m-0 mb-2">Owned by You</h3> {/* 持有者标识 */}
                  <div className="font-bold text-base mb-1">{nft.name} Token-{nft.tokenId}</div> {/* NFT 名称和编号 */}
                  <div className="text-gray-500 text-sm mb-2">{nft.desc}</div> {/* NFT 描述 */}
                  <input
                    type="text"
                    className="mt-2 max-w-[120px] mb-2 border border-[#39F] text-white font-sans font-bold text-[15px] rounded px-2 py-1"
                    placeholder="Set your price"
                    onChange={e => updateresalePrice({ ...resalePrice, price: e.target.value })}
                  /> {/* 价格输入框 */}
                  <button
                    onClick={executeRelist}
                    className="block w-full bg-gradient-to-r from-[#9D00FF] to-[#39FF14] text-white border-none rounded text-lg font-bold py-2 cursor-pointer"
                  >
                    重新上架
                  </button> {/* 重新上架按钮 */}
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}
