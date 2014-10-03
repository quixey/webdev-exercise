function Project(id, type, name, branch, UptoDate, lastActivity) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.branch = branch;
    this.UptoDate = UptoDate;
    this.lastActivity = lastActivity;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", 'outdated-branch-1', 'outdated' , new Date(2014, 6, 17, 13, 5, 842)),
    new Project(1, "Testing", "Blind test of autosuggest model", 'up-to-date-branch-1', 'updated', new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

$(function(){
    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.branch),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").html('<div class="status ' + pj.UptoDate + '">' + pj.UptoDate + '</div>')
            ).attr('id','project-' + pj.id);
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        branch = $form.find("#project-branch").val();
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            branch,
            checkUpdated(branch),
            new Date()
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
    loadProjects($projectTable, CURRENT_PROJECTS);

    $("#add-project-form").submit(function(e) {
        var $form = $(this);
        pj = createProject($form);
        MAX_ID = pj.id;
        CURRENT_PROJECTS.push(pj);
        loadProjects($projectTable, [pj]);
        resetForm($form);
        e.preventDefault();
    });


    //GITHUB API

    var masterBranch = 'baseline-branch';
    var branches = {};

    var getLastCommit = function(branch) {
      return $.ajax({
        url: 'https://api.github.com/repos/quixey/webdev-exercise/branches/' + branch.name,
        success: function (data){
          branches[data.name]= new Date(data.commit.commit.committer.date);
        }
      });
    }

    var checkUpdated = function(branch){
      return (branches[branch] < branches[masterBranch]) ? 'outdated' : 'updated';
    }

    var getBranchNames = function() {
      return $.ajax({
        url: 'https://api.github.com/repos/quixey/webdev-exercise/branches'
      });
    }

    var addBranches = function() {
      var $branchList = $('#branch-list');
      Object.keys(branches).forEach(function(branchName){
        $branchList.append('<option>' + branchName +'</option>');
      });
    }

    var getBranchData = function() {
      $.when(getBranchNames()).then(function(branches){
        var deferreds = [];
        $.each(branches, function(index, branch){
          deferreds.push(getLastCommit(branch));
        });
        $.when.apply(null, deferreds).then(function(){
            addBranches();
        });
      });
    }

    getBranchData();

});
