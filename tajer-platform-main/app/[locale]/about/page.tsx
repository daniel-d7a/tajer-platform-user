import React from 'react'
import Image from 'next/image'
export default function About() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/tajer-logo.svg" alt="placeholder" width={300} height={300}></Image>
      <div>
        <h1>what is the tajer platform</h1>
        <p>Tajer is the wholesale market for every merchant. We provide an integrated platform for merchants and companies to communicate and execute deals with ease.</p>
      </div>
      <div>
        <h2>How it works?</h2>

      </div>
    </div>
  )
};