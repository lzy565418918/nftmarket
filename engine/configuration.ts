/* 
       ___  ___    _  _  ___  _____   __  __             _         _   
 _ _  |_  )|   \  | \| || __||_   _| |  \/  | __ _  _ _ | |__ ___ | |_ 
| ' \  / / | |) | | .` || _|   | |   | |\/| |/ _` || '_|| / // -_)|  _|
|_||_|/___||___/  |_|\_||_|    |_|   |_|  |_|\__,_||_|  |_\_\\___| \__|
                                                                    
请根据实际情况更新下面的值
xxnft 是 NFT 智能合约地址
xxmarket 是 NFT 市场合约地址
xxresell 是 NFT 转售市场合约地址
xxnftcol 是已创建的 NFT Collection 合约地址
*/

/*
私钥加密
将 ethraw 替换为你的私钥 "0xPRIVATEKEY"（以太坊及其他 EVM）
将 hhraw 替换为你的私钥 "0xPRIVATEKEY"（Hardhat）
*/

import SimpleCrypto from "simple-crypto-js"
const cipherKey = "#ffg3$dvcv4rtkljjkh38dfkhhjgt"
const ethraw = "0x8207b7bbf486039b455923a402560ed041ad4b7243e9f329d6e415c00aaa9ef2";
const hhraw = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const simpleCrypto = new SimpleCrypto(cipherKey)
export const cipherEth = simpleCrypto.encrypt(ethraw)
export const cipherHH = simpleCrypto.encrypt(hhraw)

/*
HardHat 测试网
*/

export const hhresell = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const hhnftcol = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const hhrpc = "http://localhost:8545";

/*
全局参数
*/
export const mainnet = hhrpc