import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const origin = 'https://teclea-espanol.vercel.app'
const indexablePages = [
  { file: 'index.html', path: '/' },
  { file: 'public/a1-spanish-vocabulary.html', path: '/a1-spanish-vocabulary.html' },
  { file: 'public/a2-spanish-vocabulary.html', path: '/a2-spanish-vocabulary.html' },
  { file: 'public/b1-spanish-vocabulary.html', path: '/b1-spanish-vocabulary.html' },
  { file: 'public/b2-spanish-vocabulary.html', path: '/b2-spanish-vocabulary.html' },
  { file: 'public/spanish-dictation-practice.html', path: '/spanish-dictation-practice.html' },
  { file: 'public/spanish-conjugation-practice.html', path: '/spanish-conjugation-practice.html' },
  { file: 'public/spanish-accent-practice.html', path: '/spanish-accent-practice.html' },
  { file: 'public/methodology.html', path: '/methodology.html' },
].map((page) => ({ ...page, url: `${origin}${page.path}` }))

const noindexPages = [
  { file: 'public/privacy.html', path: '/privacy.html' },
  { file: 'public/404.html', path: '/404.html' },
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function capture(html, pattern, label, file) {
  const match = html.match(pattern)
  assert(match, `${file}: missing ${label}`)
  return match[1].trim()
}

function htmlFor(file) {
  const path = resolve(file)
  assert(existsSync(path), `${file}: file does not exist`)
  return readFileSync(path, 'utf8')
}

function rootInternalPath(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return null
  return decodeURIComponent(href.split(/[?#]/, 1)[0]) || '/'
}

function localFileForPath(path) {
  return path === '/' ? 'index.html' : `public${path}`
}

const titles = new Set()
const descriptions = new Set()
const routeByFile = new Map([...indexablePages, ...noindexPages].map((page) => [page.file, page.path]))
const inboundLinks = new Map(indexablePages.map((page) => [page.path, new Set()]))

for (const page of indexablePages) {
  const html = htmlFor(page.file)
  const title = capture(html, /<title>([^<]+)<\/title>/i, 'title', page.file)
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]+)"/i, 'meta description', page.file)
  const robots = capture(html, /<meta\s+name="robots"\s+content="([^"]+)"/i, 'robots directive', page.file)
  const canonical = capture(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i, 'canonical', page.file)
  const ogTitle = capture(html, /<meta\s+property="og:title"\s+content="([^"]+)"/i, 'og:title', page.file)
  const ogDescription = capture(html, /<meta\s+property="og:description"\s+content="([^"]+)"/i, 'og:description', page.file)
  const ogUrl = capture(html, /<meta\s+property="og:url"\s+content="([^"]+)"/i, 'og:url', page.file)
  const h1Count = (html.match(/<h1(?:\s[^>]*)?>/gi) ?? []).length
  const jsonLdBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  const internalHrefs = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/gi)].map((match) => match[1])

  assert(/<html\s+lang="zh-CN"/i.test(html), `${page.file}: html lang must be zh-CN`)
  assert(/<meta\s+name="viewport"/i.test(html), `${page.file}: missing mobile viewport`)
  assert(/\bindex\b/i.test(robots) && !/\bnoindex\b/i.test(robots), `${page.file}: page must be indexable`)
  assert(title.length >= 18 && title.length <= 70, `${page.file}: title length ${title.length} is outside 18–70 characters`)
  assert(description.length >= 50 && description.length <= 180, `${page.file}: description length ${description.length} is outside 50–180 characters`)
  assert(!titles.has(title), `${page.file}: duplicate title`)
  assert(!descriptions.has(description), `${page.file}: duplicate meta description`)
  assert(canonical === page.url, `${page.file}: canonical is ${canonical}, expected ${page.url}`)
  assert(ogTitle.length > 0 && ogDescription.length > 0, `${page.file}: Open Graph text is incomplete`)
  assert(ogUrl === page.url, `${page.file}: og:url is ${ogUrl}, expected ${page.url}`)
  assert(/<meta\s+name="twitter:card"\s+content="summary"/i.test(html), `${page.file}: missing Twitter summary card`)
  assert(h1Count === 1, `${page.file}: expected exactly one h1, found ${h1Count}`)
  assert(jsonLdBlocks.length > 0, `${page.file}: missing JSON-LD`)
  jsonLdBlocks.forEach((block) => JSON.parse(block[1]))
  assert(internalHrefs.length >= 2, `${page.file}: too few crawlable internal links`)

  for (const href of internalHrefs) {
    const path = rootInternalPath(href)
    if (!path) continue
    if (path.endsWith('.html')) {
      const targetFile = localFileForPath(path)
      assert(existsSync(resolve(targetFile)), `${page.file}: broken internal link ${href}`)
    }
    if (inboundLinks.has(path) && path !== page.path) inboundLinks.get(path).add(page.path)
  }

  titles.add(title)
  descriptions.add(description)
}

for (const page of noindexPages) {
  const html = htmlFor(page.file)
  const robots = capture(html, /<meta\s+name="robots"\s+content="([^"]+)"/i, 'robots directive', page.file)
  assert(/\bnoindex\b/i.test(robots), `${page.file}: supporting page must be noindex`)
  assert((html.match(/<h1(?:\s[^>]*)?>/gi) ?? []).length === 1, `${page.file}: expected exactly one h1`)
}

for (const [path, sources] of inboundLinks) {
  assert(sources.size > 0, `${path}: orphan page has no links from another indexable page`)
}

const sitemap = htmlFor('public/sitemap.xml')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
assert(sitemapUrls.length === indexablePages.length, `sitemap: expected ${indexablePages.length} URLs, found ${sitemapUrls.length}`)
indexablePages.forEach((page) => assert(sitemapUrls.includes(page.url), `sitemap: missing ${page.url}`))
noindexPages.forEach((page) => assert(!sitemapUrls.includes(`${origin}${page.path}`), `sitemap: noindex page ${page.path} must be excluded`))
assert(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap: duplicate URLs found')
assert(sitemapUrls.every((url) => !/[?#]/.test(url)), 'sitemap: URLs must not contain queries or fragments')
assert([...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].every((match) => /^\d{4}-\d{2}-\d{2}$/.test(match[1])), 'sitemap: invalid lastmod date')

const robots = htmlFor('public/robots.txt')
assert(/User-agent:\s*\*/i.test(robots), 'robots.txt: missing wildcard user agent')
assert(/Allow:\s*\//i.test(robots), 'robots.txt: root is not explicitly crawlable')
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt: sitemap URL is missing or incorrect')

const manifest = JSON.parse(htmlFor('public/manifest.webmanifest'))
assert(manifest.name && manifest.short_name && manifest.start_url === '/', 'manifest: required app metadata is incomplete')
assert(existsSync(resolve('public/favicon.svg')), 'favicon.svg: file does not exist')

const appCss = htmlFor('src/styles.css')
const seoCss = htmlFor('public/seo-pages.css')
assert(!/fonts\.googleapis\.com|@import\s+url\(['"]?https?:/i.test(`${appCss}\n${seoCss}`), 'CSS: external render-blocking font import found')

const knownFiles = new Set(routeByFile.keys())
assert(knownFiles.size === indexablePages.length + noindexPages.length, 'SEO page registry contains duplicate files')

console.log(`SEO validation passed: ${indexablePages.length} unique indexable pages, ${noindexPages.length} noindex support pages, ${sitemapUrls.length} sitemap URLs, no orphan or broken HTML links.`)
