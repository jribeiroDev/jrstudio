# Plano — Landing page JR STUDIO (Astro + Tailwind + Vercel)

## Contexto
A JR STUDIO (design/branding + desenvolvimento web) precisa de uma landing page cujo objetivo principal é **mostrar portefólio**. A pasta `C:\GITHUB\jrstudio` está vazia (sem git). Decisões tomadas contigo:

| Tema | Decisão |
|---|---|
| Stack | Astro (estático) + Tailwind CSS v4 + Vercel |
| Idiomas | PT (padrão, `/`) + EN (`/en/`) |
| Secções | Hero · Serviços · Portefólio · Sobre · Contacto |
| Estilo | Escuro / premium: fundo quase preto `#0E0E10`, texto off-white `#F5F1E8`, acento dourado `#C8A96A` |
| Contacto | Email (`mailto:`) + links de redes sociais, sem backend |
| Portefólio | Grelha de cartões na landing (sem páginas por projeto); tens as imagens |
| Logo | Monograma **B · quadro geométrico**: "JR" dentro de um quadrado dourado |
| Deploy | Repo GitHub → Vercel (deploy automático a cada push, previews nos PRs) + o teu domínio |

Ficou fora por agora (YAGNI): páginas de case study, formulário, blog, CMS, analytics. Qualquer um entra depois sem mudar a estrutura.

## Estrutura do projeto
```
jrstudio/
├─ astro.config.mjs          # site, i18n (pt/en), tailwind vite plugin, sitemap
├─ public/
│  ├─ favicon.svg            # só o monograma
│  └─ og-image.png           # 1200×630 para partilhas
├─ src/
│  ├─ assets/logo/           # monogram.svg, lockup-horizontal.svg (monograma + "JR STUDIO")
│  ├─ content/projects/      # um .md por projeto + imagem de capa ao lado
│  ├─ content.config.ts      # schema da coleção "projects" (com image())
│  ├─ i18n/pt.json, en.json  # todos os textos da landing
│  ├─ i18n/utils.ts          # t(lang, key) — função simples
│  ├─ layouts/Base.astro     # <head>, meta/OG, hreflang, fontes
│  ├─ components/            # Header, Hero, Services, Portfolio, About, Contact, Footer, Logo
│  ├─ pages/index.astro      # <Landing lang="pt" />
│  ├─ pages/en/index.astro   # <Landing lang="en" />
│  └─ styles/global.css      # @import "tailwindcss"; @theme com as cores/fontes da marca
└─ docs/superpowers/specs/2026-10-20-landing-page-design.md   # este design, versionado
```

## Fases

### 1. Setup
- `npm create astro@latest .` (template minimal, TypeScript strict), `git init`.
- `npx astro add tailwind` (Tailwind v4 via `@tailwindcss/vite`) e `npx astro add sitemap`.
- Em `global.css`, `@theme` com tokens: `--color-ink #0E0E10`, `--color-paper #F5F1E8`, `--color-gold #C8A96A`, `--color-muted #8A867E`.
- Fonte: uma sans geométrica self-hosted via `@fontsource-variable/manrope` (títulos grandes com tracking apertado, corpo normal).
- `astro.config.mjs`: `site: 'https://<teu-dominio>'`, `i18n: { defaultLocale: 'pt', locales: ['pt','en'], routing: { prefixDefaultLocale: false } }`.

### 2. Logo (monograma B)
- Desenhar em SVG puro, **letras como paths** (não `<text>`) para não depender de fontes: quadrado com contorno dourado de 2px, "JR" geométrico em off-white centrado.
- Variantes: `monogram.svg`, `lockup-horizontal.svg` (monograma + "JR STUDIO" espaçado), `favicon.svg` (traço mais grosso para ler a 16px), versão monocromática (`currentColor`) para fundos claros.
- `og-image.png` gerado a partir do lockup sobre `#0E0E10`.
- Componente `Logo.astro` faz inline do SVG (herda cor, sem pedido extra).

### 3. Layout, i18n e secções
- `Base.astro`: título/descrição por idioma, `<link rel="alternate" hreflang>` para pt/en, OG/Twitter, `lang` no `<html>`.
- `i18n/utils.ts`: `t(lang, 'hero.title')` lê o JSON; o seletor PT/EN no Header usa `getRelativeLocaleUrl` do Astro.
- Componentes (todos recebem `lang`):
  - **Header**: logo, âncoras (#servicos, #portefolio, #sobre, #contacto), toggle PT/EN; menu simples em mobile.
  - **Hero**: frase forte + subtítulo + CTA "Ver trabalhos" → #portefolio.
  - **Services**: 2 blocos — Branding & Identidade · Desenvolvimento Web — com 3–4 itens cada.
  - **Portfolio**: grelha responsiva (1/2/3 colunas) com `<Image>` do Astro (WebP/AVIF, lazy), título, categoria, ano; hover subtil com borda dourada.
  - **About**: texto curto + foto opcional.
  - **Contact**: email grande clicável + ícones de redes sociais.
  - **Footer**: lockup, © ano, links.
- Acessibilidade: contraste AA (verificar dourado sobre preto em texto pequeno), foco visível, `alt` obrigatório no schema dos projetos, `prefers-reduced-motion` nas animações.

### 4. Conteúdo do portefólio
- Schema em `content.config.ts`: `title`, `category` (`branding` | `web`), `year`, `cover: image()`, `alt: {pt, en}`, `summary: {pt, en}`, `order`, `url?` (link externo opcional).
- Um ficheiro por projeto em `src/content/projects/`; o build falha se faltar campo ou imagem (validação gratuita).

### 5. SEO
- **Palavras-chave**: escolher 1 principal + 3–5 secundárias por idioma (ex.: PT "estúdio de branding", "design de identidade visual", "desenvolvimento de websites"; EN equivalentes) e usá-las no `<title>`, `<h1>`, subtítulos das secções e `alt` das imagens — sem encher.
- **Metadados por idioma** em `Base.astro` (vindos de `pt.json`/`en.json`): `<title>` ≤ 60 caracteres, `meta description` 140–160, `<link rel="canonical">` absoluto, `hreflang` pt / en / `x-default` (→ `/`), `<html lang="pt-PT">` / `"en"`.
- **Partilhas**: Open Graph (`og:title/description/image/url/locale` + `og:locale:alternate`) e Twitter `summary_large_image`, com `og-image.png` 1200×630.
- **Dados estruturados (JSON-LD)**: `Organization`/`ProfessionalService` (nome, logo, url, email, `sameAs` com as redes sociais, `areaServed`) + `WebSite`; validar no Rich Results Test.
- **HTML semântico**: um único `<h1>` por página (no Hero), `<h2>` por secção, `<header>/<main>/<section>/<footer>`, links com texto descritivo, `alt` obrigatório (já garantido pelo schema).
- **Rastreio**: `@astrojs/sitemap` com `i18n` configurado (gera alternates no sitemap), `public/robots.txt` com `Sitemap: https://<dominio>/sitemap-index.xml`, `trailingSlash` consistente no `astro.config.mjs`.
- **Domínio único**: no Vercel, redirecionar `www` → domínio raiz (ou o inverso) para evitar conteúdo duplicado; HTTPS automático.
- **Performance = SEO** (Core Web Vitals): HTML estático, zero JS por defeito, `<Image>` com `width/height` (sem CLS), imagem do hero com `loading="eager"` + `fetchpriority="high"`, preload da fonte variável, `font-display: swap`.
- **Pós-lançamento**: verificar o domínio no Google Search Console e Bing Webmaster Tools, submeter o sitemap, e (opcional, se trabalhas localmente) criar Perfil de Empresa no Google com o mesmo nome/site.

### 6. Deploy
- Criar repo no GitHub, push, e em vercel.com → *Add New Project* → importar o repo (framework Astro detetado; output estático, **sem adapter**).
- *Settings → Domains*: adicionar o teu domínio e configurar os registos DNS que o Vercel indicar.

## O que preciso de ti durante a implementação
Textos (ou deixo rascunhos para reveres), imagens dos projetos com título/ano/categoria, email e links das redes, nome do domínio. Até lá uso placeholders marcados.

## Verificação
- `npm run build` sem erros (inclui a validação do schema dos projetos).
- `npm run preview` + browser: `/` e `/en/` renderizam, o toggle PT/EN funciona, âncoras fazem scroll, imagens otimizadas.
- Viewport mobile 375px: sem scroll horizontal, menu funciona.
- Lighthouse (Performance/Acessibilidade/Boas práticas/SEO ≥ 95) em `/` e `/en/`.
- SEO: ver o HTML gerado em `dist/` — canonical, hreflang (pt/en/x-default), OG e JSON-LD presentes e com URLs absolutos; `robots.txt` e `sitemap-index.xml` acessíveis; JSON-LD sem erros no Rich Results Test; `www` redireciona para o domínio raiz.
- Favicon visível no separador; OG image validada colando o URL de preview do Vercel.
- Depois do deploy: URL `.vercel.app` e domínio próprio em HTTPS.
