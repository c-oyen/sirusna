import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

export default function RusunPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Rusun</h1>
          <p className="text-muted-foreground">
            Kelola data dan informasi rumah susun.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Tambah Rusun
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Rumah Susun</CardTitle>
          <CardDescription>
            Semua data rumah susun yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Cari nama rusun..." />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Rusun</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Lantai</TableHead>
                <TableHead>Jumlah Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Belum ada data rusun.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
