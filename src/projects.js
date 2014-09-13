function Project(id, type, name, referenceType, reference, lastActivity, status) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.referenceType = referenceType
    this.reference = reference
    this.lastActivity = lastActivity;
    this.status = status;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", "Branch", "up-to-date-branch-1", new Date(2014, 6, 17, 13, 5, 842), "testStatus"),
    new Project(1, "Testing", "Blind test of autosuggest model", "Branch", "up-to-date-branch-2", new Date(2014, 6, 21, 18, 44, 229), "testStatus")
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
                $("<td>").text(pj.referenceType),
                $("<td>").text(pj.reference),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.status)
            );
        }));
    };

var updateProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            pj.status = getInfo(pj.reference)
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.referenceType),
                $("<td>").text(pj.reference),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.status)
            );
        }));
    };


    var getInfo = function(project_branch_name) {
        url = "https://api.github.com/repos/quixey/webdev-exercise/compare/baseline-branch..." + project_branch_name;
        var request = null;
        request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);
        res = JSON.parse(request.responseText);
        if(res.message == "Not Found") {
            alert("Invalid Branch Name");
            return "";
        }

        // return res.status

        if(res.status === 'diverged'){
            return "Pull or rebase";
        }
        else{
            return "Up to date or ahead"
        }

    }
    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            $form.find("#project-reference-type").val(),
            $form.find("#project-reference").val(),
            new Date(),
            getInfo($form.find("#project-reference").val())
        );
        debugger;
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#project-reference-type").val(""),
        $form.find("#project-reference").val(""),
        $form.find("input:first").focus();
    };

    var $projectTable = $("#project-list>tbody");
    loadProjects($projectTable, CURRENT_PROJECTS);

    $("#add-project-form").submit(function(e) {
        var $form = $(this);
        pj = createProject($form);
        MAX_ID = pj.id;
        if(pj.status != "") {
            CURRENT_PROJECTS.push(pj);
            loadProjects($projectTable, [pj]);
            resetForm($form);
            e.preventDefault();
        }
        changeFormat();
    });

    $("#update").click(function(){
        $("#tbody").empty();
        updateProjects($projectTable, CURRENT_PROJECTS);
        changeFormat();
    });

    var changeFormat = function(){
        $("table tr").each(function () {
        var status = $(this).children("td").eq(6).text()
            if(status === "Pull or rebase"){
            $(this).children("td").eq(6).addClass("red");
            }else{
            $(this).children("td").eq(6).addClass("green");
            }
        });
    }
});
