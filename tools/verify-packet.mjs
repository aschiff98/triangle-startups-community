import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const manifest = JSON.parse(readFileSync('packet-manifest.json', 'utf8'))
for (const [name, expected] of Object.entries(manifest.files)) {
  const actual = createHash('sha256').update(readFileSync(resolve(name))).digest('hex')
  if (actual !== expected) throw new Error(`Baseline file changed: ${name}`)
}
console.log(`${Object.keys(manifest.files).length} baseline file hashes verified. Run before editing.`)
