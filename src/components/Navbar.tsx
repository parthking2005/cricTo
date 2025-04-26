"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className='fixed top-0 w-full'>
    <nav className="w-full bg-black border-b-2 border-white h-16 items-center flex text-white text-xl">
      <div className="ml-8">CricTo</div>
      <ul className="flex justify-around w-96 right-0 absolute">
        <li onClick={() => router.push("/")} className='hover:text-gray-300 cursor-pointer'>Home</li>
        <li onClick={() => router.push("/blog")} className='hover:text-gray-300 cursor-pointer'>Blog</li>
        <li onClick={() => router.push("/contact")} className='hover:text-gray-300 cursor-pointer'>Contact</li>
        <li onClick={() => router.push("/about")} className='hover:text-gray-300 cursor-pointer'>About</li>
      </ul>
    </nav>
  </div>
  )
}
