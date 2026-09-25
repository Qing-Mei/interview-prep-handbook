# Interview Prep Handbook · 面试准备手册

A bilingual, static coding-interview handbook for study groups. Includes the complete interview checklist, constraints-to-algorithms reference, input-size/complexity guidelines, edge cases, and mock-interview review.

面向刷题群的中英双语静态手册：完整 coding 面试流程、约束与解法对应表、输入规模与复杂度参考、边界检查、模拟面试清单。

## Features / 功能

- Full Chinese and English content; switch languages without losing checked items.
- Search chapters, navigate a table of contents, or use compact mock-interview mode.
- 65 checklist items with stable IDs; progress stays in this browser, scoped to the project path.
- Responsive tables, keyboard-accessible controls, printable pages, and Markdown downloads.
- Static output with no runtime CDN, analytics, login, or backend.
- GitHub Actions builds pull requests and deploys pushes to `main`.

中文和英文共用勾选进度；支持章节搜索、目录、模拟面试模式、手机阅读、打印和 Markdown 下载。浏览器本地存储不会跨设备同步；清除浏览器数据也会清除进度。完整指南与精简清单用于不同练习场景，勾选独立记录。

## Local preview / 本地预览

Requires Node.js 22+; the Markdown parser is vendored, so no npm install is needed.

```bash
node build.mjs
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` for Chinese or `http://localhost:8000/en.html` for English. Serve over HTTP for consistent local-storage behavior.

## Edit content / 更新内容

1. Edit `zh.md` and `en.md` together.
2. Preserve the existing `<!-- task:check-001 -->` IDs. Both languages must use the same IDs in the same order.
3. New checklist items need new unique IDs in both languages. Never renumber old IDs; this preserves saved progress after edits.
4. The build validates matching bilingual task IDs. Keep the same nine main section positions: compact practice is section 8.
5. Run `node build.mjs` and review the output, then commit and push.

主要编辑两份 Markdown 原文即可，不需要修改生成的 HTML。现有 task ID 不要更改；新增项目在两种语言中使用同一个新 ID。网站更新后，用户刷新固定网址即可看到新内容。

The generator supports standard GitHub-flavored Markdown through the bundled Marked parser. Content is trusted repository content: review pull requests before merging. Raw HTML from repository authors is supported by the parser.

## GitHub Pages / 发布

1. Repository: https://github.com/Qing-Mei/interview-prep-handbook — keep source changes on `main`.
2. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Set `repository` in `site.config.json` to the actual repository URL to show the GitHub link in the header.
4. Push a commit or run **Build and deploy handbook** from Actions.
5. The deployment job reports the published URL. Share that fixed URL with the study group.

提交到 `main` 后自动构建发布，PR 只构建验证，不部署。Pages 权限取决于 GitHub 账号和仓库设置；普通 Pages 发布的网站可公开访问，请只提交打算分享的内容。

Official deployment reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Project layout / 目录

```text
zh.md / en.md            Chinese and English Markdown sources
style.css / app.js       Styling, local progress, search
build.mjs                Static site generator
marked.mjs               Vendored Markdown parser
site.config.json         Repository link
.github/workflows/       Build and Pages deployment
```

`dist/` is generated and ignored by git. The archive may include a built copy for easy preview.

## Contributing / 贡献

Use Discussions for general interview-process conversations and suggestions. Use Issues for specific errors. Submit content improvements through pull requests and update both translations. Problem-specific solutions can live in a separate future section.

## Third-party code / 第三方代码

The bundled Marked parser retains its MIT license in `marked-LICENSE.md`. Original handbook content and site files have no additional license grant specified yet; the repository owner may select one before broader reuse.
