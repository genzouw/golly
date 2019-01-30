<template>
  <div class="container-fluid">
    <div class="row mt-5 mb-5">
      <div class="col d-flex justify-content-center">
        <h2>ようこそ Golly へ！</h2>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center col-sm-12">
        <p>Gollyは <span class="lead text-primary">簡単に使えるアンケートサービス</span> です。</p>

      </div>
      <div class="col d-flex justify-content-center col-sm-12">
        <p>使い方は簡単。</p>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex justify-content-center text-secondary">
        <ol>
          <li>「質問」と「回答の選択肢」を入力します。</li>
          <li>「登録」ボタンを押してしばらくすると、アンケートページが表示されます。</li>
          <li>アンケートページのURLをみんなに伝えましょう！</li>
        </ol>
      </div>
    </div>

    <hr />

    <div class="row ">
      <div class="col d-flex justify-content-center">
        <h3>■アンケートを作成■</h3>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div id="message" v-bind:class="message_classes">
          {{ message }}
        </div>
      </div>
    </div>

    <form @submit.prevent>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="question" class="control-label">質問</label>
            <input type="text" id="question" name="question" placeholder="質問" class="form-control" v-model="question" required v-validate="'required|min:3'" data-vv-as="質問" />
            <div class="invalid-feedback">{{ errors.first('question') }}</div>
          </div>
          <div class="form-group">
            <label for="choices" class="control-label">回答の選択肢(スペース区切りで入力)</label>
            <ol>
              <li v-for="(it, index) in choices" v-bind:key="index">
                <div class="form-inline input-group">
                <input type="text" v-bind:name="'choice' + index" placeholder="回答の選択肢" class="form-control col-sm-10" v-model="it.text" required v-validate="'required|min:3'" data-vv-as="回答の選択肢" />
                <div class="input-group-append">
                  <div class="input-group-text bg-secondary" @click.prevent.self="removeChoice(index)">×</div>
                </div>
                </div>
                <div class="invalid-feedback">{{ errors.first('choice' + index) }}</div>
              </li>
            </ol>
            <button class="btn btn-primary btn-sm float-right" @click.prevent.self="appendChoice">選択肢を追加</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col d-flex justify-content-center col-sm-12">
          <div class="form-group">
            <button id="input-submit" class="btn btn-danger btn-lg" @click.prevent.self="regist" :disabled="input_submit_disabled">登録</button>
          </div>
        </div>
      </div>
    </form>

  </div>
</template>

<script>
var $ = require('jquery')

export default {
  data () {
    return {
      'message': '',
      'message_classes': '',
      'question': '',
      'choices': [
        { text: '' }
      ],
      // 'apiUrl': '//localhost:8081',
      'apiUrl': '',
      'input_submit_disabled': false
    }
  },
  methods: {
    'regist': function (e) {
      let that = this

      that.$validator.validate().then(function (ok) {
        if (!ok) {
          return false
        }

        $.ajax({
          url: that.apiUrl + '/questionnaires.php',
          type: 'POST',
          dataType: 'json',
          data: $.param({
            'question': that.question,
            'choices': $.map(that.choices, (it) => { return it.text.trim() }).filter((it) => { return it && it.length > 0 })
          }),
          complete: function () {

          },
          success: function (data, status) {
            that.input_submit_disabled = true
            that.message = 'アンケート( id = ' + data.id + ')の作成が完了しました！( 3秒後に遷移します。 )'
            that.message_classes = 'alert alert-success'
            setTimeout(function () {
              that.$router.push(
                {
                  'path': '/show/' + data.id
                }
              )
            }, 3000)
          },
          error: function (data, status) {
            that.message = data.responseJSON.message || 'アンケートの作成に失敗しました。'
            that.message_classes = 'alert alert-danger'
          }
        })
      })
    },
    'appendChoice': function () {
      this.choices.push({ 'text': '' })
    },
    'removeChoice': function (i) {
      console.log(i)
      this.choices.splice(i, 1)
    }
  }
}
</script>

<style>
.invalid-feedback {
  display: block;
}
</style>
