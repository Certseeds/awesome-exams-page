// ── KaTeX copy-tex (ref: https://github.com/KaTeX/KaTeX/tree/main/contrib/copy-tex) ──
import katexReplaceWithTex from 'katex/contrib/copy-tex/katex2tex'

function closestKatex(node: Node): Element | null {
  const el = node instanceof Element ? node : node.parentElement
  return el?.closest('.katex') ?? null
}

function handleCopy(event: ClipboardEvent) {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || !event.clipboardData) return

  const range = sel.getRangeAt(0)
  const startKatex = closestKatex(range.startContainer)
  if (startKatex) range.setStartBefore(startKatex)
  const endKatex = closestKatex(range.endContainer)
  if (endKatex) range.setEndAfter(endKatex)

  const fragment = range.cloneContents()
  if (!fragment.querySelector('.katex-mathml')) return

  // HTML
  const div = document.createElement('div')
  div.appendChild(fragment.cloneNode(true))
  event.clipboardData.setData('text/html', div.innerHTML)

  // Plain text: official katexReplaceWithTex, then root-child \n join
  // (official copy-tex.ts uses fragment.textContent which loses block breaks)
  const tf = katexReplaceWithTex(fragment.cloneNode(true) as DocumentFragment)
  const lines: string[] = []
  for (const child of tf.childNodes) {
    const t = child.textContent?.trim()
    if (t) lines.push(t)
  }
  const plain = lines.join('\n\n') // double \n more beautifully
  console.log('[copy-tex] copied:', plain.substring(0, 200))
  event.clipboardData.setData('text/plain', plain)
  event.preventDefault()
}

let copyBound: ((e: ClipboardEvent) => void) | null = null

export function initCopyTex() {
  copyBound = handleCopy
  document.addEventListener('copy', copyBound)
  console.log('[copy-tex] initialized')
}

export function destroyCopyTex() {
  if (copyBound) document.removeEventListener('copy', copyBound)
  copyBound = null
}
