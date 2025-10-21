"use client";
import  { useEffect, useState } from "react";
import {  ShoppingCart, ChevronLeft, ChevronRight, TicketSlash } from "lucide-react";
import {Link} from '@/i18n/navigation';
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { OrderRow } from "@/components/dashboard/OrderRow";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname } from "next/navigation";
interface Merchant {
  commercialName?: string;
}
interface Invoice {
  id: number;
  createdAt: string | null;
  totalValue: number;
  status: string;
  merchant: Merchant;
  text_id: string;
}
interface ApiResponse {
  data: Invoice[];
  meta?: {
    limit: number;
    offset: number;
    from: number;
    to: number;
    page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export default function Page() {
    const to = useTranslations("orders");
  const t = useTranslations('dashboard');
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  

  const [language, setLanguage] = useState('en')
  const pathname = usePathname();
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lang = segments[0] || 'en'; 
    setLanguage(lang)
  }, [pathname]);
  const fetchInvoice = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const data = await fetch(
        `https://tajer-backend.tajerplatform.workers.dev/api/orders/orders/user?limit=${limit}&page=${page}&status=DELIVERED&from=&to=`,
        { credentials: "include" }
      );
      const res: ApiResponse = await data.json();
      setInvoiceData(res.data || []);
      
      if (res.meta) {
        setTotalPages(res.meta.last_page || 1);
        setTotalItems(res.meta.total || 0);
        setItemsPerPage(res.meta.per_page || limit);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchInvoice(1, newLimit);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="font-cairo space-y-8 w-full mb-10">
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold">{t('invice')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('invoiceSubTitle')} 
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold">{to("Invoices")}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-4">
          <Link href="/categories">
            <button className="inline-flex text-md items-center px-4 py-2 gap-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer">
              {t('browseProducts')}
              <ShoppingCart className="w-5 h-5"/>
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {to('showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} {to('of')} {totalItems} {to('invoices')}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{to('itemsPerPage')}:</span>
          <Select 
  value={itemsPerPage.toString()} 
  onValueChange={(value) => handleItemsPerPageChange(Number(value))}
>
    <SelectTrigger  dir={language === 'ar' ? 'rtl' : 'ltr'} className="w-[130px] border rounded-md px-2 py-1 text-sm h-9">
      <SelectValue placeholder={to('itemsPerPage')} />
    </SelectTrigger>
  <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <SelectItem value="5">5</SelectItem>
    <SelectItem value="10">10</SelectItem>
    <SelectItem value="25">25</SelectItem>
    <SelectItem value="50">50</SelectItem>
  </SelectContent>
</Select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border shadow-sm mb-5">
        {(!loading && invoiceData.length === 0) ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <TicketSlash className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  {language === 'ar' ? "لا يوجد اي طلبات مكتمله حتي الآن!" : "No Orders Completed Yet!"}
                </p>
              </div>
              <Link href="/categories">
                <Button className="bg-primary hover:bg-primary/90 mt-4">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {to('BrowseProducts')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b">{to("InvoiceId")}</th>
                  <th className="p-3 border-b">{to("label.total")}</th>
                  <th className="p-3 border-b">{to("label.status")}</th>
                  <th className="p-3 border-b">{to("label.createdAt")}</th>              
                  <th className="p-3 border-b">{to("label.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-20 mx-auto" /></td>
                    </tr>
                  ))
                ) : (
                  invoiceData.map((invoice) => (
                    <OrderRow
                      key={invoice.id}
                      text_id={invoice.text_id}
                      createdAt={invoice.createdAt}
                      id={invoice.id}
                      totalValue={Number(invoice.totalValue)}
                      status={invoice.status}
                      merchant={invoice.merchant?.commercialName ?? "-"}
                    />
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                  {to('page')} {currentPage} {to('of')} {totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft  className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : "rotate-360"}`}/>
                    {to('previous')}
                  </Button>

                  <div className="flex gap-1 mx-2">
                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    {to('next')}
                    <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : "rotate-360"}`} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};