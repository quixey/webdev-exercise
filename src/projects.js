function Project(id, type, name, lastActivity, gitDiff) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.lastActivity = lastActivity;
    this.gitDiff = gitDiff;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", new Date(2014, 6, 17, 13, 5, 842)),
    new Project(1, "Testing", "Blind test of autosuggest model", new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

$(function(){
    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            debugger
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.gitDiff)
            );
        }));
    };

    var githubCall = function(githubCompare) {
        var differences = 0;
        $.ajax({
                method: 'GET',
                url: githubCompare
        }).done(function(response) {
            differences = response['ahead_by'];
            console.log(differences);
            return differences;
        }).fail(function(response) {
            return "Request to GitHub failed"
        });
    }


    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        var githubBranch = $form.find("#github-new-branch").val();
        var githubCompare = "https://api.github.com/repos/quixey/webdev-exercise/compare/master..." + githubBranch;
        var diffs = githubCall(githubCompare);
        console.log(diffs);
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            new Date(),
            diffs
        );

    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#github-new-branch").val("");
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
});
