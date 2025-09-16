"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/products/product-grid';
export default function Page() {
    const {name} = useParams()

  return (
    <div className='p-6'>
        <ProductGrid factoryId={Number(name)} categoryId={0}/>
    </div>
  );
};