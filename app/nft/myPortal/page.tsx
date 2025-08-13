'use client'

import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Resell from '@/engine/Resell.json';
import NFTCollection from '@/engine/NFTCollection.json';
// import 'sf-font';
import Web3 from 'web3';
import { hhresell, hhnftcol, mainnet, cipherHH, simpleCrypto } from '@/engine/configuration';
type NftItem = {
	name: string;
	img: string;
	tokenId: number;
	wallet: string;
	desc: string;
}
export default function Sell() {
	const [user, setUser] = useState('');
	const [resalePrice, updateresalePrice] = useState({ price: '' });
	const [nfts, setNfts] = useState<NftItem[]>([]);
	const [loading, setloading] = useState(false);
	useEffect(() => {
		connectUser();
		getWalletNFTs();
	}, []);

	const router = useRouter();

	const connectUser = async () => {
		if (window.ethereum) {
			const web3 = new Web3(window.ethereum);
			await window.ethereum.send('eth_requestAccounts');
			const accounts = await web3.eth.getAccounts();
			const account = accounts[0];
			setUser(account);
		}
	}

	const getWalletNFTs = async () => {
		debugger
		setloading(true);

		try {
			const provider = new ethers.JsonRpcProvider(mainnet);
			const key = simpleCrypto.decrypt(cipherHH);
			const wallet = new ethers.Wallet(key as string, provider);
			const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
			console.log('Contract:', contract);
			const itemArray: Array<NftItem> = [];
			const result = await contract.totalSupply();
			const totalSup = Number(result);
			console.log('Total Supply:', totalSup);
			for (let i = 0; i < totalSup; i++) {
				const token = i + 1;
				const owner = await contract.ownerOf(token).catch(function (error) {
					console.log('tokens filtered:', error);
				});
				const rawUri = await contract.tokenURI(token).catch(function (error) {
					console.log('tokens filtered:', error);
				});
				console.log('owner:', owner);
				console.log('rawUri:', rawUri);
				const response = await fetch(rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/'));
				const data = await response.json();
				if (!data) throw new Error('Failed to fetch metadata');
				console.log('data:', data)
				const { image, name, description } = data;
				const meta = {
					name: name,
					img: image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
					tokenId: token,
					wallet: owner,
					desc: description,
				};
				console.log(meta);
				itemArray.push(meta);
			}
			await new Promise(r => setTimeout(r, 3000));
			setNfts(itemArray);
		} catch (error) {
			console.log('Error fetching NFTs:', error);
		} finally {
			setloading(false);
		}
	}

	if (loading && !nfts.length)
		return (
			<div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
				<h3 style={{ color: '#888', marginBottom: 16 }}>未找到NFT，请连接钱包</h3>
			</div>
		);
	return (
		<div className="max-w-[900px] mx-auto my-10 p-6">
			<div className="mb-6">
				<h4 className="mb-2">钱包中的NFT</h4>
				<div className="text-[#39FF14] font-bold mb-4">{user}</div>
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
				{nfts.map((nft, i) => {
					const owner = user;
					if (owner.indexOf(nft.wallet) !== -1) {
						async function executeRelist() {
							const { price } = resalePrice;
							if (!price) return;
							try {
								relistNFT();
							} catch (error) {
								console.log('Transaction Failed', error);
							}
						}
						async function relistNFT() {
							const web3Modal = new Web3Modal();
							const connection = await web3Modal.connect();
							const provider = new ethers.BrowserProvider(connection);
							const signer = await provider.getSigner();
							const price = ethers.parseUnits(resalePrice.price, 'ether');
							const contractnft = new ethers.Contract(hhnftcol, NFTCollection, signer);
							await contractnft.setApprovalForAll(hhresell, true);
							const contract = new ethers.Contract(hhresell, Resell, signer);
							const listingFee = (await contract.getListingFee()).toString();
							const transaction = await contract.listSale(nft.tokenId, price, { value: listingFee });
							await transaction.wait();
							router.push('/');
						}
						return (
							<div key={i}>
								<Image
									src={nft.img}
									alt={nft.name}
									width={220}
									height={180}
									className="w-full h-[180px] object-cover rounded mb-3"
									unoptimized
								/>
								<h3 className="text-[#9D00FF] font-sans text-lg m-0 mb-2">Owned by You</h3>
								<div className="font-bold text-base mb-1">{nft.name} Token-{nft.tokenId}</div>
								<div className="text-gray-500 text-sm mb-2">{nft.desc}</div>
								<input
									type="text"
									className="mt-2 max-w-[120px] mb-2 border border-[#39F] text-white font-sans font-bold text-[15px] rounded px-2 py-1"
									placeholder="Set your price"
									onChange={e => updateresalePrice({ ...resalePrice, price: e.target.value })}
								/>
								<button
									onClick={executeRelist}
									className="block w-full bg-gradient-to-r from-[#9D00FF] to-[#39FF14] text-white border-none rounded text-lg font-bold py-2 cursor-pointer"
								>
									重新上架
								</button>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
}
