import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from '@/App'
import Create from '@/components/Create'

// jquery は window が無いと読み込み時に例外を投げる。描画では呼ばれないので空のモジュールに置き換える
jest.mock('jquery', () => ({}))

// .vue を @vue/vue3-jest で変換して描画まで通す。
// testEnvironment は node のままなので、DOM を使わない SSR で描画する。
// vue-router 5 は ESM 専用の依存を持ち jest から読み込めないため、
// router-link と router-view は置き換える。
function render (component) {
  const app = createSSRApp(component)
  app.component('RouterLink', { template: '<slot />' })
  app.component('RouterView', { template: '<p id="routed">routed</p>' })
  return renderToString(app)
}

describe('.vue の変換と描画', () => {
  it('App はナビゲーションと router-view を描画する', async () => {
    const html = await render(App)

    expect(html).toContain('<a class="navbar-brand" href="/">Golly</a>')
    expect(html).toContain('<p id="routed">routed</p>')
    expect(html).toContain('<footer id="footer"></footer>')
  })

  it('Create は質問と選択肢の入力欄を描画する', async () => {
    const html = await render(Create)

    expect(html).toContain('<h2>アンケートを作成</h2>')
    expect(html).toMatch(/<input[^>]*id="question"/)
    expect(html).toMatch(/<input[^>]*id="choices"/)
    expect(html).toMatch(/<button[^>]*id="input-submit"[^>]*>登録<\/button>/)
  })
})
