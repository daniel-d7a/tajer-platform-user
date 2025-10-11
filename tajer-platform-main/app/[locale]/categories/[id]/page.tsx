"use client";
import {useEffect, useState} from 'react'
import { useParams,usePathname} from 'next/navigation';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number,
  name: string,
  name_ar: string,
  parentId: null,
  imageUrl: null,
  image_public_id: null,
  children: [
    {
      id: number,
      name: string,
      name_ar: string,
      parentId: null,
      imageUrl: null,
      image_public_id: null
    }
  ]
}

export default function Page() {
  const [loading,setLoading] = useState(false)
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();
  const [data,setData] = useState<Product>();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en';
    setLanguage(lang);
  }, [pathname]);
  
  const {id} = useParams();
  
  const fetchData = async () =>{
    try{
      setLoading(true)
      const res = await fetch(`https://tajer-backend.tajerplatform.workers.dev/api/public/categories/${id}`)
      const json = await res.json();
      if(res.ok){
        setData(json);
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }else{
        toast.error('something went wrong please try to show more')
      }
    }catch  {
      toast.error('somehting went wrong please try again later')
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(() =>{
    fetchData();
    // eslint-disable-next-line
  },[])

  return (
    <div className="w-[90%] py-8 mx-auto">
      {!loading && 
        <h1 className='text-3xl font-bold text-center p-5'>
          {language === 'ar' ? "التصنيفات الفرعيه ل"+ data?.name_ar : "Sub Categories for "+data?.name}
        </h1>
      }
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="overflow-hidden animate-pulse mt-2">
            <div className="w-full h-56 md:h-64 lg:h-72 xl:h-80 bg-mutedcard animate-pulse"></div>
          </Card>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.children?.map((children, index) => (
            <Link 
              key={children.id} 
              href={`/categories/${id}/${children.id}`}
              className={`
                block transform transition-all duration-700 ease-out
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }
              `}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="relative w-full h-56 md:h-64 lg:h-72 xl:h-80 rounded-md overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
                <Image
                  src={children.imageUrl || '/coffee.jpg'}
                  alt={children.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                  <div className="transform group-hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-2">
                      {language === 'en' ? children.name : children.name_ar}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};