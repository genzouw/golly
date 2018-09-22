<template>
  <div class="container-fluid">
    <div class="row mt-5 mb-5">
      <div class="col d-flex justify-content-center">
        <h2>ようこそ Golly へ！</h2>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center">
        <p>Gollyは <span class="lead">簡単に使えるアンケートサービス</span> です。</p>

      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center">
        <p>使い方は簡単。</p>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center text-success">
        <ol>
          <li>質問と回答の選択肢を登録</li>
          <li>アンケートページのURLをみんなに伝える</li>
        </ol>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center">
        <p class="h3">
        <router-link to="/create">こちらをクリックして、早速始めてみましょう！</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
