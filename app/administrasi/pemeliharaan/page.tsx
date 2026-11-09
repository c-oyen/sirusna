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

export default function PemeliharaanPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Pemeliharaan</h1>
          <p className="text-muted-foreground">
            Kelola perawatan dan perbaikan fasilitas rumah susun.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Tambah Pemeliharaan
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemeliharaan</CardTitle>
          <CardDescription>
            Riwayat pekerjaan perawatan dan perbaikan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="Cari pemeliharaan..." />
            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diajukan">Diajukan</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Laporan</TableHead>
                <TableHead>Rusun</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Jenis Kerusakan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Petugas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Belum ada data pemeliharaan.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
