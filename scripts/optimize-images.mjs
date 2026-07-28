import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')

// [source, output-basename, max-width]
const jobs = [
  ['bkt-banner.jpg', 'bkt-banner', 1920],
  ['WhatsApp-Image-2025-05-01-at-07.12.05-4.jpeg', 'tractor-field', 1920],
  ['13760_z__MG_9135_1_1-scaled.jpeg', 'tyre-detail', 1920],
  ['BKT-TRUCK-PICTURE.jpg', 'bkt-truck', 1000],
]

for (const [src, out, width] of jobs) {
  const inPath = path.join(DIR, src)
  const outPath = path.join(DIR, `${out}.webp`)
  const meta = await sharp(inPath).metadata()
  const w = Math.min(width, meta.width)
  await sharp(inPath)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(outPath)
  console.log(`${src} (${meta.width}x${meta.height}) -> ${out}.webp @ ${w}w`)
}
console.log('done')
