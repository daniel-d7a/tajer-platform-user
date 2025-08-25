import React from 'react'
import { Button } from '@/components/ui/button';

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div>
        {children}
            <div className="p-6 flex gap-2 ">
                <Button className="bg-primary p-2 rounded-md px-4 py-2  rounded-md shadow-sm text-sm font-medium ">Save Changes</Button>
                <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium  hover:bg-gray-800 cursor-pointer">cancel</button>
            </div>
    </div>
  )
};