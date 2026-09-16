/*
 * Fails the build if an unfilled placeholder would ship.
 *
 * The privacy page withholds TODO_ lines at render time, but a placeholder in a
 * meta description or a price would go straight to a visitor. This is the
 * backstop: a hard non-zero exit, not a warning someone scrolls past.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist'
const FATAL = /__[A-Z_]{3,}__|PRICE_TODO/
/* TODO_ legal data is known-missing and deliberately withheld by PrivacyPage,
   so it is reported but does not fail the build until the values arrive. */
const WARN = /TODO_[A-Z_]+/

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* files(path)
    else if (/\.(html|js|css)$/.test(entry.name)) yield path
  }
}

let fatal = 0
const warned = new Set()

for await (const path of files(DIST)) {
  const text = await readFile(path, 'utf8')
  for (const m of text.match(new RegExp(FATAL, 'g')) ?? []) {
    console.error(`placeholder shipped: ${m} in ${path}`)
    fatal++
  }
  for (const m of text.match(new RegExp(WARN, 'g')) ?? []) warned.add(m)
}

if (warned.size) {
  console.warn(`\n  still unfilled (withheld from the page): ${[...warned].join(', ')}`)
  console.warn('  the privacy statement is incomplete until these are real values\n')
}

if (fatal) {
  console.error(`\n${fatal} placeholder(s) would have shipped to visitors.`)
  process.exit(1)
}
