function Project(id, type, name, branchName, lastActivity, status) {
  this.id = id;
  this.type = type;
  this.name = name;
  this.branchName = branchName;
  this.lastActivity = lastActivity;
  this.status = false;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
new Project(0, "Training", "Patrick's experimental branch", "outdated-branch-1", new Date(2014, 6, 17, 13, 5, 842)),
new Project(1, "Testing", "Blind test of autosuggest model", "up-to-date-branch-1", new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

$(function(){

  var isUpToDate = function(branchName){
   if(branchName === "master"){
    return true;
   }
   $.each(branchCommits, function(index, branch){
     if(branch.name === branchName){
       if(branch.commitDate >= lastCommitToMaster){
         return true;
       }
     }
   })
   return false;
  }


  var loadProjects = function($container, projects) {
    $.fn.append.apply($container, $.map(projects, function(pj) {

      return $("<tr>").append(
        $("<td>").text(pj.id),
        $("<td>").text(pj.type),
        $("<td>").text(pj.name),
        $("<td>").text(pj.branchName),
        $("<td>").text(pj.lastActivity.toString()),
        $("<td>").html('<p class="status" id=' + pj.branchName + '>' + formatProjectStatus(isUpToDate(pj.branchName)) + '</p>')
        );
      //if I had more time, I would want to update the project's status accordingly.
    }));
  };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
      return new Project(
        MAX_ID + 1,
        $form.find("#project-type").val(),
        $form.find("#project-name").val(),
        $form.find("#project-branch").val(),
        new Date($.now())
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
      $form.find("#project-type").val("");
      $form.find("#project-branch").val("");
      $form.find("#project-name").val("");
      $form.find("input:first").focus();
    };

    var $projectTable = $("#project-list>tbody");
    // loadProjects($projectTable, CURRENT_PROJECTS);

    $("#add-project-form").submit(function(e) {
      var $form = $(this);
      pj = createProject($form);
      MAX_ID = pj.id;
      CURRENT_PROJECTS.push(pj);
      loadProjects($projectTable, [pj]);
      resetForm($form);
      e.preventDefault();
    });

    //populate branch dropdown with branch names
    var projectBranches = [];
    var branchCommits = [];

    var getExistingProjectBranches = function(){
      return $.ajax({
        url: "https://api.github.com/repos/quixey/webdev-exercise/branches",
        type: "GET",
        success: function(branches){
          $.each(branches, function(index, branch){
            projectBranches.push(branch.name);
          })
        }
      })
    }

    var addExistingBranchOptions = function(projectBranches){
      $.each(projectBranches, function(index, branch){
        $('#branch-list').append('<option>' + branch + '</option>');
      })
    }

    var branchCommits;
    var lastCommitToMaster;

    var getLastBranchCommit = function(projectBranchName){
      $.ajax({
        url: "https://api.github.com/repos/quixey/webdev-exercise/branches/" + projectBranchName,
        type: "GET",
        success: function(branch){
          var branchName = branch.name;
          branchCommits.push({name: branchName, commitDate: branch.commit.commit.committer.date});

          if(branch.name === "master"){
            lastCommitToMaster = branch.commit.commit.committer.date;
          }
        }
      })
    }

    function preloadProjectBranchesDropdown() {

     $.when( getExistingProjectBranches() ).then(
       function(projectBranches) {
        $.each(projectBranches, function(index, branch){
          getLastBranchCommit(branch.name)
        })
        var dfd = jQuery.Deferred();
        setTimeout(function() {
          dfd.resolve();
        }, Math.floor( 1000 ) );
        return dfd.promise();
      }
      ).then(function(){
        loadProjects($projectTable, CURRENT_PROJECTS);
        addExistingBranchOptions(projectBranches);
        showBranchStatus();
        $('#add-project-menu').show();
      });

    }
    preloadProjectBranchesDropdown();
   //handle date status
   //branch's last commit date is found by going through object > commit > committer > date
   //committer is not always the author of the patch

   var showBranchStatus = function(){
    var branchesOnDom = $('.status');
    $.each(branchesOnDom, function(index, branch){
      var branchName = branch.id;
      var branchStatus = isUpToDate(branchName)

      $('#' + branchName).html(formatProjectStatus(branchStatus));
    })
   }

   var formatProjectStatus = function(projectStatus){
    if(projectStatus){
      return '<span class="green" >Up to Date</span>'
    }
    else{
      return '<span class="red" >Outdated</span>'
    }
   }

});
