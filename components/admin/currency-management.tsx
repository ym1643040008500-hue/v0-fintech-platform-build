"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { AdminCurrencyService, type CurrencyInput } from "@/lib/admin-currency-service"
import type { Currency } from "@/lib/types"

export function CurrencyManagement() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [formData, setFormData] = useState<CurrencyInput>({
    code: "",
    name: "",
    symbol: "",
    decimals: 2,
    enabled: true,
    exchangeRate: 1,
    icon: "",
    description: "",
  })
  const { toast } = useToast()
  const adminCurrencyService = AdminCurrencyService.getInstance()

  useEffect(() => {
    loadCurrencies()
  }, [])

  const loadCurrencies = async () => {
    try {
      setLoading(true)
      const data = await adminCurrencyService.getAllCurrencies()
      setCurrencies(data)
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل العملات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCurrency) {
        await adminCurrencyService.updateCurrency(editingCurrency.id, formData)
        toast({
          title: "تم التحديث",
          description: "تم تحديث العملة بنجاح",
        })
      } else {
        await adminCurrencyService.addCurrency(formData)
        toast({
          title: "تم الإضافة",
          description: "تم إضافة العملة بنجاح",
        })
      }

      setIsAddDialogOpen(false)
      setEditingCurrency(null)
      resetForm()
      loadCurrencies()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ العملة",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (currencyId: string, enabled: boolean) => {
    try {
      await adminCurrencyService.toggleCurrencyStatus(currencyId, enabled)
      toast({
        title: "تم التحديث",
        description: `تم ${enabled ? "تفعيل" : "إلغاء تفعيل"} العملة`,
      })
      loadCurrencies()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة العملة",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (currencyId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه العملة؟")) return

    try {
      await adminCurrencyService.deleteCurrency(currencyId)
      toast({
        title: "تم الحذف",
        description: "تم حذف العملة بنجاح",
      })
      loadCurrencies()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف العملة",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      symbol: "",
      decimals: 2,
      enabled: true,
      exchangeRate: 1,
      icon: "",
      description: "",
    })
  }

  const openEditDialog = (currency: Currency) => {
    setEditingCurrency(currency)
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      decimals: currency.decimals,
      enabled: currency.enabled,
      exchangeRate: currency.exchangeRate,
      icon: currency.icon || "",
      description: currency.description || "",
    })
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة العملات</h2>
          <p className="text-gray-400">إضافة وإدارة العملات المتاحة في المنصة</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingCurrency(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة عملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">{editingCurrency ? "تعديل العملة" : "إضافة عملة جديدة"}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingCurrency ? "تعديل بيانات العملة" : "إضافة عملة جديدة للمنصة"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-white">
                    رمز العملة
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="USD"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol" className="text-white">
                    رمز العملة
                  </Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    placeholder="$"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name" className="text-white">
                  اسم العملة
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="الدولار الأمريكي"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="decimals" className="text-white">
                    عدد الخانات العشرية
                  </Label>
                  <Input
                    id="decimals"
                    type="number"
                    min="0"
                    max="8"
                    value={formData.decimals}
                    onChange={(e) => setFormData({ ...formData, decimals: Number.parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="exchangeRate" className="text-white">
                    سعر الصرف (مقابل USD)
                  </Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={formData.exchangeRate}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: Number.parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">
                  الوصف
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف العملة"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
                />
                <Label htmlFor="enabled" className="text-white">
                  مفعلة
                </Label>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                  {editingCurrency ? "تحديث" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            العملات المتاحة ({currencies.length})
          </CardTitle>
          <CardDescription className="text-gray-400">إدارة جميع العملات في المنصة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">العملة</TableHead>
                <TableHead className="text-gray-300">الرمز</TableHead>
                <TableHead className="text-gray-300">سعر الصرف</TableHead>
                <TableHead className="text-gray-300">الحالة</TableHead>
                <TableHead className="text-gray-300">آخر تحديث</TableHead>
                <TableHead className="text-gray-300">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {currency.symbol}
                      </div>
                      <div>
                        <div className="font-medium text-white">{currency.name}</div>
                        <div className="text-sm text-gray-400">{currency.code}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-mono">{currency.code}</TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {currency.exchangeRate.toFixed(6)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={currency.enabled ? "default" : "secondary"}>
                      {currency.enabled ? "مفعلة" : "معطلة"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{currency.lastUpdated.toLocaleDateString("ar-EG")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(currency.id, !currency.enabled)}
                      >
                        {currency.enabled ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(currency)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(currency.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
