import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

export default function InspeksiPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Inspeksi Hunian</h1>
          <p className="text-muted-foreground">
            Kelola pemeriksaan kondisi unit dan fasilitas Rusun.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Buat Inspeksi
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Inspeksi</CardTitle>
          <CardDescription>Riwayat pemeriksaan unit hunian.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Inspeksi</TableHead>
                <TableHead>Rusun</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Petugas</TableHead>
                <TableHead>Tanggal Inspeksi</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Hasil</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Belum ada data inspeksi.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
