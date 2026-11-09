import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function PengaturanPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Pengaturan umum aplikasi SIRUSNA.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Identitas Aplikasi</CardTitle>
          <CardDescription>
            Informasi instansi dan identitas aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama-aplikasi">Nama Aplikasi</Label>
              <Input
                id="nama-aplikasi"
                name="namaAplikasi"
                defaultValue="SIRUSNA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instansi">Nama Instansi</Label>
              <Input id="instansi" name="instansi" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat Instansi</Label>
              <Textarea id="alamat" name="alamat" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Instansi</Label>
              <Input id="email" name="email" type="email" />
            </div>

            <Button type="button">Simpan Pengaturan</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Tarif</CardTitle>
          <CardDescription>
            Konfigurasi tarif dan pembayaran sewa Rusun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tarif">Tarif Sewa Bulanan (Rp)</Label>
              <Input id="tarif" name="tarif" type="number" min="0" />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="jatuh-tempo">Tanggal Jatuh Tempo</Label>
              <Input
                id="jatuh-tempo"
                name="jatuhTempo"
                type="number"
                min="1"
                max="31"
              />
            </div>

            <Button type="button">Simpan Tarif</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
