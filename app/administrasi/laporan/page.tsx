import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function LaporanPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Laporan</h1>
        <p className="text-muted-foreground">
          Laporan dan statistik pengelolaan rumah susun.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Tentukan jenis dan periode laporan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Jenis Laporan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="penghuni">Laporan Penghuni</SelectItem>
                  <SelectItem value="hunian">Laporan Hunian</SelectItem>
                  <SelectItem value="pengajuan">Laporan Pengajuan</SelectItem>
                  <SelectItem value="keuangan">Laporan Keuangan</SelectItem>
                  <SelectItem value="tunggakan">Laporan Tunggakan</SelectItem>
                  <SelectItem value="pemeliharaan">
                    Laporan Pemeliharaan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rusun">Rusun</Label>
              <Select>
                <SelectTrigger id="rusun">
                  <SelectValue placeholder="Semua Rusun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Rusun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mulai">Tanggal Mulai</Label>
              <Input id="mulai" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="akhir">Tanggal Akhir</Label>
              <Input id="akhir" type="date" />
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <Button type="button">Tampilkan Laporan</Button>
              <Button type="button" variant="outline">
                Ekspor Laporan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hasil Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada laporan yang ditampilkan.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
