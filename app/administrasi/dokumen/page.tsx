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
import { UploadSimpleIcon } from "@phosphor-icons/react/dist/ssr"

export default function DokumenPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Dokumen</h1>
          <p className="text-muted-foreground">
            Kelola arsip dokumen administrasi rumah susun.
          </p>
        </div>
        <Button>
          <UploadSimpleIcon />
          Unggah Dokumen
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Arsip Dokumen</CardTitle>
          <CardDescription>
            Dokumen administrasi yang tersimpan dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input placeholder="Cari dokumen..." />
            <Select>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kontrak">Kontrak</SelectItem>
                <SelectItem value="identitas">Identitas</SelectItem>
                <SelectItem value="pengajuan">Pengajuan</SelectItem>
                <SelectItem value="surat">Surat</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Nomor Dokumen</TableHead>
                <TableHead>Tanggal Unggah</TableHead>
                <TableHead>Pengunggah</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Belum ada dokumen.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
