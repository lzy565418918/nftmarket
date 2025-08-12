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
	const [user, getUser] = useState('');
	const [resalePrice, updateresalePrice] = useState({ price: '' });
	const [nfts, setNfts] = useState<NftItem[]>([]);
	const [loadingState, setLoadingState] = useState(false);
	useEffect(() => {
		connectUser();
		getWalletNFTs();
	}, [nfts, user]);
	const router = useRouter();

	const connectUser = async () => {
		if (window.ethereum) {
			const web3 = new Web3(window.ethereum);
			await window.ethereum.send('eth_requestAccounts');
			const accounts = await web3.eth.getAccounts();
			const account = accounts[0];
			getUser(account);
		}
	}

	const getWalletNFTs = async () => {
		const provider = new ethers.JsonRpcProvider(mainnet);
		const key = simpleCrypto.decrypt(cipherHH);
		const wallet = new ethers.Wallet(key as string, provider);
		const contract = new ethers.Contract(hhnftcol, NFTCollection, wallet);
		const itemArray: Array<NftItem> = [];
		contract.totalSupply().then(result => {
			const totalSup = parseInt(result, 16);
			for (let i = 0; i < totalSup; i++) {
				const token = i + 1;
				const owner = contract.ownerOf(token).catch(function (error) {
					console.log('tokens filtered:', error);
				});
				const rawUri = contract.tokenURI(token).catch(function (error) {
					console.log('tokens filtered:', error);
				});
				const Uri = Promise.resolve(rawUri);
				const getUri = Uri.then(async value => {
					const str = value;
					const cleanUri = str.replace('ipfs://', 'https://ipfs.io/ipfs/');
					console.log(cleanUri);
					try {
						const response = await fetch(cleanUri);
						if (!response.ok) {
							console.log('Failed to fetch metadata');
							return null;
						}
						const data = await response.json();
						return data;
					} catch (error) {
						console.log(error);
						return null;
					}
				});
				getUri.then((data: { image: string; name: string; description: string } | null) => {
					if (!data) return;
					const rawImg = data.image;
					const name = data.name;
					const desc = data.description;
					const image = rawImg.replace('ipfs://', 'https://ipfs.io/ipfs/');
					Promise.resolve(owner).then(value => {
						const ownerW = value;
						const meta = {
							name: name,
							img: image,
							tokenId: token,
							wallet: ownerW,
							desc,
						};
						console.log(meta);
						itemArray.push(meta);
					});
				});
			}
		});
		await new Promise(r => setTimeout(r, 3000));
		setNfts(itemArray);
		setLoadingState(true);
	}

	if (loadingState && !nfts.length)
		return (
			<div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
				<h3 style={{ color: '#888', marginBottom: 16 }}>未找到NFT，请连接钱包</h3>
			</div>
		);
	return (
		<div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
			<div style={{ marginBottom: 24 }}>
				<h4 style={{ marginBottom: 8 }}>钱包中的NFT</h4>
				<div style={{ color: '#39FF14', fontWeight: 'bold', marginBottom: 16 }}>{user}</div>
				<div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
					<button onClick={connectUser} style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #39FF14', background: '#fff', color: '#39FF14', cursor: 'pointer' }}>刷新钱包</button>
					<button onClick={getWalletNFTs} style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid #9D00FF', background: '#fff', color: '#9D00FF', cursor: 'pointer' }}>刷新NFT</button>
				</div>
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
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
									style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }}
									unoptimized
								/>
								<h3 style={{ color: '#9D00FF', fontFamily: 'SF Pro Display', fontSize: 18, margin: 0, marginBottom: 8 }}>Owned by You</h3>
								<div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{nft.name} Token-{nft.tokenId}</div>
								<div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{nft.desc}</div>
								<input
									type="text"
									style={{ marginTop: 8, maxWidth: 120, marginBottom: 8, border: '1px solid #39F', color: 'black', fontFamily: 'SF Pro Display', fontWeight: 'bolder', fontSize: 15, borderRadius: 4, padding: '4px 8px' }}
									placeholder="Set your price"
									onChange={e => updateresalePrice({ ...resalePrice, price: e.target.value })}
								/>
								<button onClick={executeRelist} style={{ display: 'block', width: '100%', background: 'linear-gradient(90deg,#9D00FF,#39FF14)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 18, fontWeight: 'bold', padding: '8px 0', cursor: 'pointer' }}>
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
