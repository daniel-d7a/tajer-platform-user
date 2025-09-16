"use client"
import React from 'react'
import { useParams } from 'next/navigation';
export default function Page() {
    const {name} = useParams()

  return (
    <div className=''>
        <h1>{name}</h1>
    </div>
  );
};