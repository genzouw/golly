// loaders.spec.js が webpack でビルドする入力。@generated はテストが一時ディレクトリへ生成するバイナリを指す
import smallImage from '@generated/small.png'
import largeImage from '@generated/large.png'
import largeFont from '@generated/large.woff2'
import largeMedia from '@generated/large.mp4'
import Fixture from './Fixture.vue'
import './style.css'

export default { smallImage, largeImage, largeFont, largeMedia, Fixture }
