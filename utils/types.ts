
// NFT 数据类型定义
export type NftItem = {
  name: string; // NFT 名称
  img: string; // NFT 图片链接
  cost?: string; // NFT 价格（wei）
  val?: string; // NFT 价格（ether）
  tokenId: number; // NFT 编号
  wallet: string; // NFT 持有者钱包地址
  desc: string; // NFT 描述
}