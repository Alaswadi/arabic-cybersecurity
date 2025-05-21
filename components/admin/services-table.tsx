"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { FallbackImage } from "@/components/ui/fallback-image"
import { adminTheme } from "@/lib/admin-theme"

type Service = Database["public"]["Tables"]["services"]["Row"]

export function ServicesTable({ services }: { services: Service[] }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!serviceToDelete) return

    try {
      console.log("Deleting service with ID:", serviceToDelete.id);

      // Use the API route to delete the service
      const response = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء حذف الخدمة");
      }

      toast({
        title: "تم الحذف",
        description: "تم حذف الخدمة بنجاح",
      });

      // Force a server refresh
      await fetch('/api/revalidate?path=/admin/services', { method: 'POST' });

      // Add a small delay before refreshing
      setTimeout(() => {
        router.refresh();
        setServiceToDelete(null);
      }, 500);
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الخدمة",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <div style={{
        borderRadius: adminTheme.borderRadius.md,
        border: `1px solid ${adminTheme.colors.border.light}`,
        overflow: 'hidden',
        boxShadow: adminTheme.shadows.sm
      }}>
        <Table>
          <TableHeader style={{ backgroundColor: adminTheme.colors.background.sidebar }}>
            <TableRow>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>العنوان</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الأيقونة</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الصورة</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>تاريخ الإنشاء</TableHead>
              <TableHead className="w-[100px]" style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{
                  textAlign: 'center',
                  color: adminTheme.colors.text.secondary,
                  padding: adminTheme.spacing.xl
                }}>
                  لا توجد خدمات
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} style={{
                  backgroundColor: adminTheme.colors.background.card,
                  borderBottom: `1px solid ${adminTheme.colors.border.light}`
                }}>
                  <TableCell style={{
                    fontWeight: adminTheme.typography.fontWeights.medium,
                    color: adminTheme.colors.text.primary
                  }}>
                    {service.title}
                  </TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>{service.icon}</TableCell>
                  <TableCell>
                    {service.image ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden" style={{
                        border: `1px solid ${adminTheme.colors.border.light}`
                      }}>
                        <FallbackImage
                          src={service.image}
                          alt={service.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <span style={{ color: adminTheme.colors.text.muted }}>-</span>
                    )}
                  </TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>
                    {new Date(service.created_at).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          style={{ color: adminTheme.colors.text.secondary }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        style={{
                          backgroundColor: adminTheme.colors.background.card,
                          border: `1px solid ${adminTheme.colors.border.light}`,
                          boxShadow: adminTheme.shadows.md
                        }}
                      >
                        <Link href={`/admin/services/${service.id}`}>
                          <DropdownMenuItem style={{ color: adminTheme.colors.text.primary }}>
                            <Edit className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                            تعديل
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setServiceToDelete(service)
                            setIsDeleteDialogOpen(true)
                          }}
                          style={{ color: adminTheme.colors.status.danger }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent style={{
          backgroundColor: adminTheme.colors.background.card,
          border: `1px solid ${adminTheme.colors.border.light}`,
          boxShadow: adminTheme.shadows.lg,
          borderRadius: adminTheme.borderRadius.lg
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: adminTheme.colors.text.primary }}>
              هل أنت متأكد من حذف هذه الخدمة؟
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: adminTheme.colors.text.secondary }}>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الخدمة نهائياً من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{
              borderColor: adminTheme.colors.border.main,
              color: adminTheme.colors.text.primary
            }}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{
                backgroundColor: adminTheme.colors.status.danger,
                color: 'white'
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
