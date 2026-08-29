import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import frontMatter from 'front-matter'
import { runPreflight } from './preflight'

interface FrontmatterAttributes {
  title?: string;
  summary?: string;
  image?: string;
  date?: string | Date;
  draft?: boolean;
  tags?: string[];
  libraries?: string[];
  [key: string]: any;
}

const ROOT_DIR = path.resolve(__dirname, '../..')
const NOTES_DIR = path.resolve(ROOT_DIR, 'site/content/notes')

function resolveNotePath(input: string): string {
  let candidate = path.isAbsolute(input) ? input : path.resolve(ROOT_DIR, input)
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate
  }

  // Try in site/content/notes/
  candidate = path.resolve(NOTES_DIR, input.endsWith('.md') ? input : `${input}.md`)
  if (fs.existsSync(candidate)) {
    return candidate
  }

  // Try in site/content/
  candidate = path.resolve(ROOT_DIR, 'site/content', input.endsWith('.md') ? input : `${input}.md`)
  if (fs.existsSync(candidate)) {
    return candidate
  }

  throw new Error(`Could not find markdown note file for input: "${input}"`)
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`
}

function formatTagDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export async function publishNote(filePathInput: string, options: { dryRun?: boolean; noDateUpdate?: boolean; noCommit?: boolean } = {}) {
  const filePath = resolveNotePath(filePathInput)
  const relativePath = path.relative(ROOT_DIR, filePath)
  const slug = path.basename(filePath, '.md')

  console.log(`\n📦 Preparing publication for: ${relativePath}`)

  const rawContent = fs.readFileSync(filePath, 'utf8')
  const parsed = frontMatter<FrontmatterAttributes>(rawContent)
  const attrs = parsed.attributes
  const now = new Date()

  // 1. Update frontmatter metadata (date = now, remove draft)
  if (!options.noDateUpdate) {
    let updatedContent = rawContent

    // Update date to current timestamp if requested
    const formattedDate = formatDate(now)
    if (updatedContent.match(/^date:\s*.*$/m)) {
      updatedContent = updatedContent.replace(/^date:\s*.*$/m, `date: ${formattedDate}`)
    }

    // Remove draft: true or draft: false
    updatedContent = updatedContent.replace(/^draft:\s*.*$\n?/m, '')

    if (updatedContent !== rawContent) {
      if (options.dryRun) {
        console.log(`[DRY RUN] Would update frontmatter: date=${formattedDate}, removed draft property`)
      } else {
        fs.writeFileSync(filePath, updatedContent, 'utf8')
        console.log(`✏️ Updated frontmatter in ${relativePath} (date: ${formattedDate}, draft removed)`)
      }
    }
  }

  // 2. Build site to ensure assets and html are fresh for Playwright
  console.log('\n🔨 Rebuilding site distribution for preflight check...')
  try {
    execSync('bun run build', { cwd: ROOT_DIR, stdio: 'pipe' })
  } catch (err: any) {
    console.error('❌ Site build failed during publication:', err.message)
    process.exit(1)
  }

  // 3. Run Preflight verification
  console.log(`\n🔍 Executing Preflight on: ${relativePath}`)
  const preflightResult = await runPreflight(filePath)

  if (!preflightResult.valid) {
    console.error('\n❌ Preflight validation failed! Fix issues before publishing:')
    for (const issue of preflightResult.issues) {
      const icon = issue.type === 'error' ? '❌' : '⚠️'
      console.error(`  ${icon} [${issue.category.toUpperCase()}] ${issue.message}`)
    }
    process.exit(1)
  }
  console.log('✅ Preflight validation passed!')

  // 4. Generate Git Release Tag
  const tagDate = formatTagDate(now)
  const tagName = `v${tagDate}-${slug}`
  const title = attrs.title || slug
  const commitMsg = `Publish note: ${title}`

  console.log('\n🚀 Publication Details:')
  console.log(`  - File:       ${relativePath}`)
  console.log(`  - Title:      ${title}`)
  console.log(`  - Tag Name:   ${tagName}`)
  console.log(`  - Commit Msg: ${commitMsg}`)

  if (options.dryRun) {
    console.log('\n[DRY RUN] Completed. No git commits or tags were created.')
    return { tagName, commitMsg, preflightResult }
  }

  if (options.noCommit) {
    console.log('\n⚠️ --no-commit set: Skipping git commit and tagging.')
    return { tagName, commitMsg, preflightResult }
  }

  // 5. Create Git Commit and Tag
  try {
    execSync(`git add "${filePath}"`, { cwd: ROOT_DIR })
    if (attrs.image) {
      const imagePath = path.resolve(ROOT_DIR, 'site/static/images', attrs.image)
      if (fs.existsSync(imagePath)) {
        execSync(`git add "${imagePath}"`, { cwd: ROOT_DIR })
      }
    }
    const status = execSync('git status --porcelain', { cwd: ROOT_DIR }).toString()
    if (status.includes(relativePath)) {
      execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR })
      console.log(`\n✅ Committed changes: "${commitMsg}"`)
    } else {
      console.log('\nℹ️ No unstaged changes to commit.')
    }

    // Check if tag already exists
    const existingTags = execSync('git tag -l', { cwd: ROOT_DIR }).toString().split('\n')
    if (existingTags.includes(tagName)) {
      console.log(`⚠️ Git tag "${tagName}" already exists. Skipping tag creation.`)
    } else {
      execSync(`git tag -a "${tagName}" -m "Release: ${title.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR })
      console.log(`🏷️ Created git tag: ${tagName}`)
    }

    console.log('\n🎉 Ready to publish to GitHub!')
    console.log('Run the following command to deploy and trigger automated release:')
    console.log('\n  git push origin main --tags\n')
  } catch (err: any) {
    console.error('\n❌ Git operation failed:', err.message)
    process.exit(1)
  }

  return { tagName, commitMsg, preflightResult }
}

// CLI Execution
if (import.meta.main) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const noDateUpdate = args.includes('--no-date-update')
  const noCommit = args.includes('--no-commit')
  const targetFiles = args.filter(a => !a.startsWith('--'))

  if (targetFiles.length === 0) {
    console.error('Usage: bun run src/scripts/publish-note.ts <note-slug-or-file.md> [--dry-run] [--no-date-update] [--no-commit]')
    process.exit(1)
  }

  publishNote(targetFiles[0], { dryRun, noDateUpdate, noCommit })
}
