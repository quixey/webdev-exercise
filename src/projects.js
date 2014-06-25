function Project(id, type, name, lastActivity, branchName, needsUpdate) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.lastActivity = lastActivity;
    this.branchName = branchName;
    this.update = needsUpdate;
}

var USER; // Owner name of the github repo
var MASTER_REPO; // Name of the master branch

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", new Date(2014, 6, 17, 13, 5, 842), "training", true),
    new Project(1, "Testing", "Blind test of autosuggest model", new Date(2014, 6, 21, 18, 44, 229), "testing", false)
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
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.branchName),
                $("<td>").text(pj.update)
            );
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            new Date(),
            $form.find("#branch-name").val() ? $form.find("#branch-name").val() : $form.find("#project-type").val(),
            needsUpdate($form.find("#project-name").val()) // TO DO: Make this call deferred. At present this field is not getting the correct value.
        );
    };


    var needsUpdate = function(branchName) {
        var masterURL = 'https://api.github.com/repos/'+USER+'/'+MASTER_REPO;
        var branchURL = 'https://api.github.com/repos/'+USER+'/'+MASTER_REPO+'/'+branchName;
        var update = false;
        // Execute the ajax requests on the master branch url and the new branch's url
        // Process the response object. If the last updated date of the master branch precedes 
        // the creation date of the new branch then no update is required for the new branch.
        $.when( $.ajax( masterURL ), $.ajax( branchURL ) ).done(function( response1, response2 ) {
              var master_updated_date = new Date(response1[0].updated_at);
              var branch_created_date = new Date(response2[0].created_at);
              update = (branch_created_date < master_updated_date) ? true : false;
        });
        return update;
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#branch-name").val("");
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
