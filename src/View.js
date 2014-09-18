var View = (function() {
  var statusArea = '#project-list i.status';
  var projectTable = '#project-list>tbody';

  return {
    faPass : 'fa-thumbs-up green',
    faFail : 'fa-thumbs-down red',
    faInvalid : 'fa-exclamation-triangle red',
    textInvalid : ' invalid data',
    $statuses : null,
    $projectTable : $(projectTable),
    updateStatusArea : function() {
      this.$statuses = $(statusArea);
    },
    resetForm : function($form) {
      $form.find("#github-name").val("");
      $form.find("#repo-name").val("");
      $form.find("#branch-sha").val("");
      $form.find("input:first").focus();
    },
    loadProjects : function(projects) {
      $.fn.append.apply(this.$projectTable, $.map(projects, function(pj) {
        return $("<tr>").append(
          $("<td>").text(pj.id),
          $("<td>").text(pj.ghUsername),
          $("<td>").text(pj.repoName),
          $("<td>").text(pj.branchOrSha),
          $("<td><i class='status fa'></i></td>")
        );
      }));
    }
  };
})();


