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

    <VeeForm ref="form" @submit="ignoreSubmit">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="question" class="control-label">質問</label>
            <VeeField type="text" id="question" name="question" placeholder="質問" class="form-control" v-model="question" required :rules="questionRules" />
            <VeeErrorMessage as="div" name="question" class="invalid-feedback" />
          </div>
          <div class="form-group">
            <label for="choices" class="control-label">選択肢(スペース区切りで入力)</label>
            <VeeField type="text" id="choices" name="choices" placeholder="選択肢" class="form-control" v-model="choices" required :rules="choicesRules" />
            <VeeErrorMessage as="div" name="choices" class="invalid-feedback" />
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
    </VeeForm>
  </div>
</template>

<script>
import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage } from 'vee-validate'
import { requiredMin } from '@/validation'

const $ = require('jquery')

export default {
  components: { VeeForm, VeeField, VeeErrorMessage },
  data () {
    return {
      questionRules: requiredMin('質問', 3),
      choicesRules: requiredMin('選択肢', 3),
      message: '',
      message_classes: '',
      question: '',
      choices: '',
      // 'apiUrl': '//localhost:8081',
      apiUrl: '',
      input_submit_disabled: false
    }
  },
  computed: {
    separatedChoices: function () {
      return this.choices.trim().length > 0 ? this.choices.trim().split(/[ 　]+/mgi) : []
    }
  },
  methods: {
    regist: function (e) {
      const that = this

      that.$refs.form.validate().then(function (result) {
        if (!result.valid) {
          return false
        }

        $.ajax({
          url: that.apiUrl + '/questionnaires.php',
          type: 'POST',
          dataType: 'json',
          data: $.param({
            question: that.question,
            choices: that.separatedChoices
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
                  path: '/show/' + data.id
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
    // 送信は「登録」ボタンの regist で行う。VeeForm は submit ハンドラが無いと
    // 検証通過後にネイティブ送信するため、何もしないハンドラを渡して止める
    ignoreSubmit: function () {}
  }
}
</script>

<style>
.invalid-feedback {
  display: block;
}
</style>
