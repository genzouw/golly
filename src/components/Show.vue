<template>
  <div class="container-fluid">
    <div class="row mt-5 mb-5">
      <div class="col d-flex justify-content-center">
        <h2>質問：{{ question }}</h2>
      </div>
    </div>

    <div class="row">
      <div class="col" v-if="message">
        <div id="message" v-bind:class="message_classes">
          {{ message }}
        </div>
      </div>
    </div>

    <div class="row mb-1" v-for="(it, index) in choices" :key="index">
      <div class="col-sm-8">
        <button class="btn btn-primary" style="width: 3em;" @click.self="click(it.id)" :disabled="choices_button_disabled">{{ index+1 }}</button>
        <span>{{ it.choice }}</span>
      </div>
      <div class="col-sm-4">
        <div class="text-secondary font-weight-bold float-right" v-if="choices_button_disabled && it.selected_number">投票数 : <div style="width: 4em; text-align: right;">{{it.selected_number}} 件</div></div>
      </div>

      <hr />
    </div>
  </div>
</template>

<script>
var $ = require('jquery')

export default {
  data () {
    return {
      'id': this.$route.params.id,
      'message': '',
      'message_classes': '',
      'question': '',
      'choices': [],
      // 'apiUrl': '//localhost:8081',
      'apiUrl': '',
      'choices_button_disabled': false
    }
  },
  created () {
    this.refresh(false)
  },
  methods: {
    'refresh': function (all) {
      let that = this
      let data = {
        'id': that.id
      }

      if (localStorage[that.id]) {
        this.choices_button_disabled = true
        that.message = 'ご協力ありがとうございました。 m(_ _)m / 最新の投票結果は以下の通りです。'
        that.message_classes = 'alert alert-success'
      }

      if (all) {
        data['all'] = true
      }
      $.ajax({
        url: that.apiUrl + '/questionnaires.php',
        type: 'GET',
        dataType: 'json',
        'data': $.param(data),
        success: function (data) {
          that.question = data.question
          that.choices = data.choices
          document.title = 'アンケート:' + that.question + ' - Golly'
        }
      })
    },
    'click': function (id) {
      let that = this
      $.ajax({
        url: that.apiUrl + '/choices.php?id=' + id,
        type: 'PUT',
        dataType: 'json',
        success: function (data) {
          that.choices_button_disabled = true
          that.message = 'ご協力ありがとうございました。 m(_ _)m / 最新の投票結果は以下の通りです。'
          that.message_classes = 'alert alert-success'

          localStorage[that.id] = true

          that.refresh(true)
        },
        error: function () {
          that.message = '回答の受付に失敗しました。'
          that.message_classes = 'alert alert-error'
        }
      })
    }
  }
}
</script>
