'use client'
 
import React from 'react'
import dynamic from 'next/dynamic'
 
// const App = dynamic(() => import('../../App'), { ssr: false })
const Index = dynamic(() => import('../../main'), { ssr: false })
 
export function ClientOnly() {
  return <Index />
}