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
// 转售市场
export const hhresell = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
// 收集NFT
export const hhnftcol = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// NFT 合约，创作者用来创作的
export const hhnft = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// NFT 市场，只有创作出来的NFT第一次放在市场上卖，和转售市场不一样
export const hhmarket = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const hhrpc = "http://localhost:8545";

/*
全局参数
*/
export const mainnet = hhrpc
/*

NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/

import {create as ipfsHttpClient} from 'ipfs-http-client'
export const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' })
// var mumbai = 'https://matic-mumbai.chainstacklabs.com';
// var goerli = 'https://rpc.ankr.com/eth_goerli';
// var rinkeby = 'https://rpc.ankr.com/eth_rinkeby';

// /*
// CHANGE THIS TO YOUR PREFERRED TESTNET
// */
// var hhrpc = goerli;
// /*
// Global Parameters
// */
// export var mainnet = hhrpc

// /*
// DON'T FORGET TO SAVE!
// */