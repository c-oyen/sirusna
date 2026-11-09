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

export default function JadwalPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Jadwal & Kegiatan</h1>
          <p className="text-muted-foreground">
            Kelola agenda dan kegiatan operasional Rusun.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Tambah Kegiatan
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kegiatan</CardTitle>
          <CardDescription>
            Agenda kegiatan dan jadwal operasional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Belum ada kegiatan.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
