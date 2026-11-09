import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

const summaries = [
  { title: "Total Tagihan", value: "Rp 0" },
  { title: "Total Pembayaran", value: "Rp 0" },
  { title: "Total Tunggakan", value: "Rp 0" },
]

export default function TransaksiPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Tagihan & Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola tagihan sewa dan pembayaran penghuni.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Tambah Transaksi
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {summaries.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>Riwayat pembayaran sewa penghuni.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="Cari nomor transaksi atau penghuni..." />
            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="belum-bayar">Belum Dibayar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Transaksi</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
