"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/products/product-grid';

interface factoryNames {
  name:string;
  name_ar:string;
}
export default function Page() {
    const {name} = useParams()
    const [factoryName,setFactoryName] = useState<factoryNames>()
    const fetchFactoryName = async () =>{
      try{
        const response = await fetch('https://tajer-backend.tajerplatform.workers.dev/api/admin/factories/'+name,{credentials:'include'})
        const data = await response.json()
        setFactoryName(data)
      }finally{
        console.log('true')
      }
    }
    useEffect(() => {
      fetchFactoryName()
  },[])
  return (
    <div className='p-6 flex flex-col gap-10'>

        <h2 className="text-4xl font-bold text-center"> منتجاتنا من شركه {factoryName?.name_ar}  </h2>
        <ProductGrid factoryId={Number(name)} categoryId={0}/>
    </div>
  );
};