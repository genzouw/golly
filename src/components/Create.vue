<template>
  <div class="container-fluid">
    <div class="row mt-5 mb-5">
      <div class="col d-flex justify-content-center">
        <h2>アンケートを作成</h2>
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
            <label for="choices" class="control-label">選択肢(スペース区切りで入力)</label>
            <input type="text" id="choices" name="choices" placeholder="選択肢" class="form-control" v-model="choices" required v-validate="'required|min:3'" data-vv-as="選択肢" />
            <div class="invalid-feedback">{{ errors.first('choices') }}</div>
          </div>
          <div class="row">
            <div class="col">
              <ul style="list-style:none;">
                <li v-for="(it, index) in separatedChoices" :key="index">
                  {{ index+1 }} : {{ it }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="form-group">
            <button id="input-submit" class="btn btn-primary float-right btn-lg" @click.prevent.self="regist" :disabled="input_submit_disabled">登録</button>
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
      'choices': '',
      // 'apiUrl': '//localhost:8081',
      'apiUrl': '',
      'input_submit_disabled': false
    }
  },
  computed: {
    'separatedChoices': function () {
      return this.choices.trim().length > 0 ? this.choices.trim().split(/[ 　]+/mgi) : []
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
            'choices': that.separatedChoices
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
    }
  }
}
</script>

<style>
.invalid-feedback {
  display: block;
}
</style>
