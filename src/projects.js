function Project(id, type, name, branch, status, lastActivity) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.branch = branch;
    this.status = status;
    this.lastActivity = lastActivity;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", 'outdated-branch-1', 'Outdated' , new Date(2013, 12, 14, 13, 7, 678)),
    new Project(1, "Testing", "Testing of new DB Connection", 'up-to-date-branch-2', 'Updated', new Date(2014, 6, 25, 18, 74, 986))
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
                $("<td>").text(pj.status)
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
            checkStatus(branch),
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


    // GITHUB API IMPLEMENTATION
    var masterBranch = 'baseline-branch'; // Base Branch
    var branches = {}; // Empty Object for Branches

    // Function for Getting the Datestamp of latest Commit
    var getLatestCommitDate = function(branch) {
      return $.ajax({
        url: 'https://api.github.com/repos/quixey/webdev-exercise/branches/' + branch.name,
        success: function (data){
          branches[data.name]= new Date(data.commit.commit.committer.date);
        }
      });
    }

    //Check Status against masterBranch and return if its up to date or if it needs updating
    var checkStatus = function(branch){
      return (branches[branch] < branches[masterBranch]) ? 'Outdated' : 'Updated';
    }

    var getBranchNames = function() {
      return $.ajax({
        url: 'https://api.github.com/repos/quixey/webdev-exercise/branches'
      });
    }

    var addBranchesToDataList = function() {
      var $branchesList = $('#branches-list');
      Object.keys(branches).forEach(function(branchName){
        $branchesList.append('<option>' + branchName +'</option>');
      });
    }

    var getBranchInformation = function() {
      $.when(getBranchNames()).then(function(branches){
        var result = [];
        $.each(branches, function(index, branch){
          result.push(getLatestCommitDate(branch));
        });
        $.when.apply(null, result).then(function(){
            addBranchesToDataList();
        });
      });
    }


    // Kick it off
    getBranchInformation();

});