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

export default function KontrakPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Kontrak Sewa</h1>
          <p className="text-muted-foreground">
            Kelola perjanjian dan masa berlaku sewa penghuni.
          </p>
        </div>
        <Button>
          <PlusIcon />
          Buat Kontrak
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kontrak</CardTitle>
          <CardDescription>
            Kontrak sewa dan status masa berlaku.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="Cari nomor kontrak atau penghuni..." />
            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="berakhir">Berakhir</SelectItem>
                <SelectItem value="akan-berakhir">Akan Berakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Kontrak</TableHead>
                <TableHead>Penghuni</TableHead>
                <TableHead>Rusun</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Berakhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Belum ada kontrak sewa.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
