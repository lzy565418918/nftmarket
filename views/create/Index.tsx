"use client"

import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 修正导入
import Web3Modal from "web3modal";
import { NFT, Market } from '@/abis';
import { hhnft, hhmarket } from '@/engine/configuration';
import 'sf-font';
import { create as ipfsHttpClient, IPFSHTTPClient } from 'ipfs-http-client';

export default function createMarket() {
  const [client, setClient] = useState<IPFSHTTPClient>()
  const [fileUrl, setFileUrl] = useState('')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  useEffect(() => {
    const _client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' })
    setClient(_client)
  }, []) // 加上依赖数组，避免重复执行

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !client) return;
    const file = files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const createMarket = async () => {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl || !client) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createNFT(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const createNFT = async (url: string) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.BrowserProvider(connection)
    const signer = await provider.getSigner()
    let contract = new ethers.Contract(hhnft, NFT, signer)
    let transaction = await contract.createNFT(url)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()
    const price = ethers.parseUnits(formInput.price, 'ether')
    contract = new ethers.Contract(hhmarket, Market, signer)
    let listingFee = await contract.listingFee()
    listingFee = listingFee.toString()
    transaction = await contract.createVaultItem(hhnft, tokenId, price, { value: listingFee })
    await transaction.wait()
    router.push('/')
  }

  const buyNFT = async () => {
    const { name, description } = formInput
    if (!name || !description || !fileUrl || !client) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      mintNFT(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const mintNFT = async (url: string) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.BrowserProvider(connection)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(hhnft, NFT, signer)
    const cost = await contract.cost()
    const transaction = await contract.mintNFT(url, { value: cost })
    await transaction.wait()
    router.push('/portal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 font-sans py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">NFT Creator Portal</h2>
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[280px]">
            <h3 className="text-xl text-[#39FF14] font-semibold mb-2">The NFT Marketplace with a Reward.</h3>
            <h3 className="text-xl text-[#9D00FF] font-semibold mb-4">N2DR IS More Than A Token</h3>
            <img src='n2dr-logo.png' width="300" className="rounded shadow mb-6" alt="logo" />
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="bg-black/40 rounded-lg p-4 mb-4 shadow">
              <span className="text-white">Select your Preferred Network, Create your Amazing NFT by uploading your art using the simple NFT Dashboard. Simple!</span>
            </div>
            <img src='chainagnostic.png' className="rounded shadow mb-4" alt="chain" />
            <div className="bg-black/40 rounded-lg p-4 shadow">
              <span className="text-white">Chain-Agnostic Marketplace that allows you to sell your NFT and accept your favorite crypto as payment! No borders, No restrictions. Simple!</span>
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <h3 className="text-xl text-white font-semibold mb-4">Create and Sell your NFT in the Marketplace</h3>
            <div className="max-w-xs mx-auto bg-white/5 rounded-lg shadow p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your NFT Name"
                  className="w-full px-3 py-2 rounded bg-black text-white border border-gray-700 mb-2"
                  onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="NFT Description"
                  className="w-full px-3 py-2 rounded bg-black text-white border border-gray-700 mb-2"
                  onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                  type="file"
                  name="Asset"
                  className="w-full text-white mb-2"
                  onChange={onChange}
                />
                {fileUrl && (
                  <img className="rounded w-full mb-2" src={fileUrl} alt="NFT preview" />
                )}
                <input
                  type="text"
                  placeholder="Set your price in N2DR"
                  className="w-full px-3 py-2 rounded bg-black text-white border border-gray-700 mb-4"
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <button
                  type="button"
                  onClick={createMarket}
                  className="w-full py-2 mb-2 rounded bg-gradient-to-r from-[#9D00FF] to-[#39FF14] text-white font-bold text-lg shadow hover:opacity-90 transition"
                >
                  List your NFT!
                </button>
                <button
                  type="button"
                  onClick={buyNFT}
                  className="w-full py-2 rounded bg-gradient-to-r from-[#39FF14] to-[#9D00FF] text-white font-bold text-lg shadow hover:opacity-90 transition"
                >
                  Buy your NFT!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}