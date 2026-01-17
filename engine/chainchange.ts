export async function bscChain() {
	try {
		// 钱包在安装启用后会向window注入ethereum全局变量，遵循 EIP-1193/EIP-3326/EIP-3085 标准，处理 “链未添加（4902 错误）” 的兜底逻辑
		// 冻结核心属性：Object.freeze(window.ethereum) 禁止修改 request、on 等核心方法，发起请求后必须通过钱包UI页面手动操作
		// 一定程度上避免了被黑客无感知盗取财产
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x38' }],
		});
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x38',
							chainName: 'Binance Smart Chain',
							nativeCurrency: {
								name: 'BNB',
								symbol: 'BNB',
								decimals: 18,
							},
							rpcUrls: ['https://bsc-dataseed2.defibit.io'],
							blockExplorerUrls: ['https://bscscan.com/'],
						},
					],
				});
			} catch (addError) {
				console.log('Error adding Chain');
			}
		}
	}
}
export async function polyChain() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x89' }],
		});
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x89',
							chainName: 'Polygon',
							nativeCurrency: {
								name: 'MATIC',
								symbol: 'MATIC',
								decimals: 18,
							},
							rpcUrls: ['https://matic-mainnet.chainstacklabs.com'],
							blockExplorerUrls: ['https://polygonscan.com/'],
						},
					],
				});
			} catch (addError) {
				console.log('Error adding Chain');
			}
		}
	}
}

export async function ethChain() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x1' }],
		});
	} catch (switchError) {
		console.log('Wallet Not Connected');
	}
}

export async function hardChain() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x7A69' }],
		});
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x7A69',
							chainName: 'HardHat',
							nativeCurrency: {
								name: 'ETH',
								symbol: 'ETH',
								decimals: 18,
							},
							rpcUrls: ['http://node.a3b.io:8545'],
							blockExplorerUrls: [''],
						},
					],
				});
			} catch (addError) {
				console.log('Error adding Chain');
			}
		}
	}
}

export async function bscTest() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x61' }],
		});
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x61',
							chainName: 'BSC Testnet',
							nativeCurrency: {
								name: 'tBNB',
								symbol: 'tBNB',
								decimals: 18,
							},
							rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545'],
							blockExplorerUrls: ['https://testnet.bscscan.com/'],
						},
					],
				});
			} catch (addError) {
				console.log('Error adding Chain');
			}
		}
	}
}

export async function ethTest() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x5' }],
		});
	} catch (switchError) {
		console.log('Wallet Not Connected');
	}
}

export async function polyTest() {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x13881' }],
		});
	} catch (switchError: any) {
		if (switchError.code === 4902) {
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x13881',
							chainName: 'Polygon Mumbai',
							nativeCurrency: {
								name: 'MATIC',
								symbol: 'MATIC',
								decimals: 18,
							},
							rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
							blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
						},
					],
				});
			} catch (addError) {
				console.log('Error adding Chain');
			}
		}
	}
}
