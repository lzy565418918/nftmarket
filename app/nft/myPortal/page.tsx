import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import Resell from '@/engine/Resell.json';
import NFTCollection from '@/engine/NFTCollection.json';
import { Card, Button, Input, Spacer } from '@heroui/react';
import 'sf-font';
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
			<Container sm>
				<Row>
					<Col>
						<Text h3>No NFT&#39;s Found, Connect Wallet</Text>
					</Col>
				</Row>
				<Spacer></Spacer>
			</Container>
		);
	return (
		<div>
			<Container sm>
				<Row>
					<Col>
						<Text h4>
							NFT&#39;s in Wallet{' '}
							<Text h5 css={{ color: '#39FF14' }}>
								{' '}
								{user}
							</Text>
						</Text>
						<Row>
							<Button size='sm' onPress={connectUser} style={{ marginRight: '$2', marginBottom: '$2' }}>
								Refresh Wallet
							</Button>
							<Button size='sm' onPress={getWalletNFTs} style={{ marginRight: '$2', marginBottom: '$2' }}>
								Refresh NFTs
							</Button>
						</Row>
					</Col>
				</Row>
				<Grid.Container gap={3}>
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
								<Grid>
									<a>
										<Card isHoverable key={i} css={{ mw: '200px', marginRight: '$1' }} variant='bordered'>
											<Card.Image src={nft.img} />
											<Card.Body sm key={i}>
												<h3 style={{ color: '#9D00FF', fontFamily: 'SF Pro Display' }}>Owned by You</h3>
												<Text h5>
													{nft.name} Token-{nft.tokenId}
												</Text>
												<Text>{nft.desc}</Text>
												<Input
													size='sm'
													css={{ marginTop: '$2', maxWidth: '120px', marginBottom: '$2', border: '$blue500' }}
													style={{ color: 'black', fontFamily: 'SF Pro Display', fontWeight: 'bolder', fontSize: '15px' }}
													placeholder='Set your price'
													onChange={e => updateresalePrice({ ...resalePrice, price: e.target.value })}
												/>
												<Button size='sm' color='gradient' onPress={executeRelist} style={{ fontSize: '20px' }}>
													Relist for Sale
												</Button>
											</Card.Body>
										</Card>
									</a>
								</Grid>
							);
						}
					})}
				</Grid.Container>
			</Container>
		</div>
	);
}
