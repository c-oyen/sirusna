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

export default function UnitPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Unit Hunian</h1>
          <p className="text-muted-foreground">
            Kelola unit, kamar, dan ketersediaan hunian.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Tambah Unit
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Unit</CardTitle>
          <CardDescription>
            Informasi unit berdasarkan rusun dan blok.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Rusun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Rusun</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tersedia">Tersedia</SelectItem>
                <SelectItem value="dihuni">Dihuni</SelectItem>
                <SelectItem value="perbaikan">Dalam Perbaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Rusun</TableHead>
                <TableHead>Blok</TableHead>
                <TableHead>Lantai</TableHead>
                <TableHead>Nomor Unit</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Belum ada data unit.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
