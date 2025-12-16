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

import SimpleCrypto from 'simple-crypto-js';
const cipherKey = '#ffg3$dvcv4rtkljjkh38dfkhhjgt';
const ethraw = '0x8207b7bbf486039b455923a402560ed041ad4b7243e9f329d6e415c00aaa9ef2';
const hhraw = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
export const cipherHH = simpleCrypto.encrypt(hhraw);

/*
HardHat 测试网
*/
// 转售市场
export const hhresell = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
// 收集NFT
export const hhnftcol = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// NFT 合约，创作者用来创作的
export const hhnft = '0x9A676e781A523b5d0C0e43731313A708CB607508';
// NFT 市场，只有创作出来的NFT第一次放在市场上卖，和转售市场不一样
export const hhmarket = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';
const hhrpc = 'http://localhost:8545';

/*
全局参数
*/
export const mainnet = hhrpc;
/*

NETWORK RPC ADDRESSES, Choose one then 
change the value of "hhrpc" below.
*/

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
/*
Goerli Testnet
*/
export var goeresell = "YOUR CONTRACT ADDRESS";
export var goenftcol = "YOUR CONTRACT ADDRESS";
export var goenft = "YOUR CONTRACT ADDRESS";
export var goemarket = "YOUR CONTRACT ADDRESS";
export var goerpc = "https://rpc.ankr.com/eth_goerli";

/*
BSC Testnet
*/
export var bsctresell = "YOUR CONTRACT ADDRESS";
export var bsctnftcol = "YOUR CONTRACT ADDRESS";
export var bsctnft = "YOUR CONTRACT ADDRESS";
export var bsctmarket = "YOUR CONTRACT ADDRESS";
export var bsctrpc = "https://data-seed-prebsc-2-s3.binance.org:8545";

/*
Mumbai Testnet
*/
export var mmresell = "YOUR CONTRACT ADDRESS";
export var mmnftcol = "YOUR CONTRACT ADDRESS";
export var mmnft = "YOUR CONTRACT ADDRESS";
export var mmmarket = "YOUR CONTRACT ADDRESS";
export var mmrpc = "https://matic-testnet-archive-rpc.bwarelabs.com";