/**
 * @jest-environment node
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import baseConfig from '../../../build/webpack.base.conf'
import utils from '../../../build/utils'

// src は画像・フォントを import せず、style-loader は dev 設定でしか通らないため、
// npm run build の成否ではアセットとスタイルのルールを検証できない。ここで実際の入力を通す。
const INLINE_LIMIT = 10000

const compile = (config) => new Promise((resolve, reject) => {
  webpack(config, (err, stats) => {
    if (err) return reject(err)
    resolve(stats.toJson({ all: false, assets: true, errors: true, warnings: true }))
  })
})

describe('webpack のアセット・スタイルのルール', () => {
  let workDir
  let stats
  let bundle

  beforeAll(async () => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'golly-loaders-'))
    const generatedDir = path.join(workDir, 'generated')
    const outputDir = path.join(workDir, 'dist')
    fs.mkdirSync(generatedDir)
    // ルールは拡張子とサイズだけで分岐するため、中身は任意のバイト列でよい
    fs.writeFileSync(path.join(generatedDir, 'small.png'), Buffer.alloc(INLINE_LIMIT, 1))
    for (const name of ['large.png', 'large.woff2', 'large.mp4']) {
      fs.writeFileSync(path.join(generatedDir, name), Buffer.alloc(INLINE_LIMIT + 1, 1))
    }

    stats = await compile({
      ...baseConfig,
      mode: 'development',
      devtool: false,
      entry: { fixture: path.resolve(__dirname, '../fixtures/loaders/entry.js') },
      output: { path: outputDir, filename: '[name].js', publicPath: '/' },
      resolve: {
        ...baseConfig.resolve,
        alias: { ...baseConfig.resolve.alias, '@generated': generatedDir }
      },
      module: {
        rules: [
          ...baseConfig.module.rules,
          // webpack.dev.conf.js と同じく extract を指定しない (style-loader を通す)
          ...utils.styleLoaders({ sourceMap: false, usePostCSS: true })
        ]
      },
      plugins: [new VueLoaderPlugin()]
    })
    bundle = fs.readFileSync(path.join(outputDir, 'fixture.js'), 'utf8')
  }, 60000)

  afterAll(() => {
    fs.rmSync(workDir, { recursive: true, force: true })
  })

  const assetNames = () => stats.assets.map((asset) => asset.name)

  it('エラーなくビルドできる', () => {
    expect(stats.errors).toEqual([])
  })

  it('上限以下の画像は data URL として埋め込む', () => {
    expect(bundle).toContain('data:image/png;base64,')
    expect(assetNames().filter((name) => name.includes('small'))).toEqual([])
  })

  it('上限を超えるアセットは種類ごとのディレクトリへハッシュ付きで出力する', () => {
    const names = assetNames()
    expect(names).toContainEqual(expect.stringMatching(/^static\/img\/large\.[0-9a-f]{7}\.png$/))
    expect(names).toContainEqual(expect.stringMatching(/^static\/fonts\/large\.[0-9a-f]{7}\.woff2$/))
    expect(names).toContainEqual(expect.stringMatching(/^static\/media\/large\.[0-9a-f]{7}\.mp4$/))
  })

  it('.css と .vue の <style> を style-loader で注入する', () => {
    expect(bundle).toContain('style-loader/dist/runtime/injectStylesIntoStyleTag.js')
    expect(bundle).toContain('.loader-fixture-css')
    expect(bundle).toContain('.loader-fixture-vue')
  })
})
