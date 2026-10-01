// vee-validate 4 にはルール名の文字列指定（'required|min:3'）と同梱の日本語メッセージが無いため、
// 使っている 2 つのルールだけを検証関数として定義する。
// メッセージは vee-validate-locale-ja（v2 向け）の文言に合わせている。

/**
 * 「必須」と「最小文字数」を検証する関数を返す。
 * 返り値の関数は、妥当なら true、不正ならエラーメッセージを返す。
 */
export function requiredMin (label, length) {
  return function (value) {
    const text = value == null ? '' : String(value)
    if (text.trim().length === 0) {
      return `${label}は必須です`
    }
    if (text.length < length) {
      return `${label}は${length}文字以上で入力してください`
    }
    return true
  }
}
