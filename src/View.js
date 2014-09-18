var View = (function() {
  var statusArea = '#project-list i.status';

  return {
    faPass : 'fa-thumbs-up green',
    faFail : 'fa-thumbs-down red',
    faInvalid : 'fa-exclamation-triangle red',
    textInvalid : ' invalid data',
    $statuses : null,
    updateStatusArea : function() {
      this.$statuses = $(statusArea);
    },
    resetForm : function($form) {
      $form.find("#github-name").val("");
      $form.find("#repo-name").val("");
      $form.find("#branch-sha").val("");
      $form.find("input:first").focus();
    }
  };
})();


