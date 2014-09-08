function Project(id, type, name, branch, upToDate, lastActivity) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.branch = branch;
    this.upToDate = upToDate;
    this.lastActivity = lastActivity;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", "outdated-branch-1", false, new Date(2014, 6, 17, 13, 5, 842)),
    new Project(1, "Testing", "Blind test of autosuggest model", "up-to-date-branch-2", true, new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

var okIcon = function(){ return '<i class="glyphicon glyphicon-ok"></i>' }
$(function(){
    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.branch),
                $("<td>").html('<span class="updated-' + pj.upToDate + '"></span>'),
                $("<td>").text(pj.lastActivity.toString())
            );
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        var branchName = $form.find("#project-branch").val()
        var status

        $.each(branchCommits, function(index, branch){
            if(branch.name === branchName){ status = branch.isUpToDate }
        })

        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            branchName,
            status,
            new Date()
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#project-branch").val("");
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


    // Get Github API branch data

    var branchNames = [];
    var branchCommits = [];
    var userSetMasterBranchName = 'baseline-branch'
    var masterBranch


    var getBranchNames = function(){
        return $.ajax({
            url: 'https://api.github.com/repos/quixey/webdev-exercise/branches',
            type: 'GET',
            success: function(branches){
                $.each(branches, function(index, branch){
                    branchNames.push(branch.name)
                });
            }
        });
    }

    var getBranchCommit = function(branchName){
        return $.ajax({
            url: 'https://api.github.com/repos/quixey/webdev-exercise/branches/' + branchName,
            type: 'GET',
            success: function(branchCommit){
                branchCommits.push(branchCommit)

                if(branchCommit.name === userSetMasterBranchName) {
                    masterBranch = branchCommit
                }
            }
        });
    }

    // 'up-to-date' is defined as branch committer date >= master committer date
    var isUpToDate = function(master, branch){
        if( new Date(branch.commit.commit.committer.date) >= new Date(master.commit.commit.committer.date) ) {
            return true;
        } else {
            return false;
        }
    }

    var updateBranchStatuses = function(branches){
        $.each(branches, function(index, branch){
            isUpToDate(masterBranch, branch) ? branch.isUpToDate = true : branch.isUpToDate = false
        })

    }

    var appendBranchOptions = function(branchObjs){
        $.each(branchObjs, function(index, branch){
            $('#branch-list').append('<option>' + branch.name + '</option>')
        })
    }

    var getAllBranchData = function(){
        $.when(getBranchNames()).then(function(branches){
            var dfd = $.Deferred()
            $.each(branches, function(index, branch){
                getBranchCommit(branch.name)
            })
            setTimeout(function(){ dfd.resolve() }, 1000)
            return dfd.promise();
        }).then(function(){
            updateBranchStatuses(branchCommits)
            appendBranchOptions(branchCommits)
        })
    }

    getAllBranchData()



});

