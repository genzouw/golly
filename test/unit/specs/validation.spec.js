import { requiredMin } from '@/validation'

describe('requiredMin', () => {
  const validate = requiredMin('名前', 3)

  it('空・空白のみ・null・undefined は必須エラーを返す', () => {
    const message = '名前は必須です'
    expect(validate('')).toBe(message)
    expect(validate('   ')).toBe(message)
    expect(validate(null)).toBe(message)
    expect(validate(undefined)).toBe(message)
  })

  it('最小文字数未満は文字数エラーを返す', () => {
    expect(validate('ab')).toBe('名前は3文字以上で入力してください')
  })

  it('最小文字数以上は true を返す', () => {
    expect(validate('abc')).toBe(true)
    expect(validate('あいうえ')).toBe(true)
  })
})
