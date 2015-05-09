function Project(id, type, name, lastActivity, state) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.lastActivity = lastActivity;
    this.state = state;
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

// Need to use head sha to check if the branch is outdated or up-to-date.
var HEAD_ID;

// This is base github url, you can modify it by yourself.
// NOTE: It seems that we should to add a URL column, or retrieve all from user,
// and then allow user to choose the one.
var BASE_GITHUB_URL = "https://api.github.com/repos/yuevrin/webdev-exercise";

$(function(){
    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.lastActivity.toString()),
                $("<td>").text(pj.state)
            );
        }));
    };

    var addBranchChoices = function(options) {
        $("#branch-id").append("<option value=" + options.value + ">" + options.text + "</option>");
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        return new Project(
            MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            new Date()
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("input:first").focus();
    };

    var $projectTable = $("#project-list>tbody");

    // Get details of branch from github
    var getEachBranchDetails = function(url) {
        requestDetails = $.ajax({
            type:     "GET",
            dataType: "json",
            url:      url
            })
            .done(function(data) {
                 console.log(data);
                 branchesObj = {};
                 branchesObj['name'] = data.name;
                 branchesObj['date'] = data.commit.commit.committer.date;
                 branchesObj['parents'] = data.commit.parents;
                 branchesObj['version'] = data.commit.sha;
                 var project = [];
                 var currentStatus = "outdated";

		 if (branchesObj.name != "baseline-branch") {
		    for (i = 0; i < branchesObj.parents.length; i++) { 
                        if (branchesObj.parents[i].sha == HEAD_ID) {
                           currentStatus = "up-to-date";
			   break;
		        }
		    }
		 } else {
		     currentStatus = "up-to-date";
		 }

		 project.push(new Project(MAX_ID + 1, "Analysis", branchesObj.name, new Date(branchesObj.date), currentStatus));
        	 loadProjects($projectTable, project);
       		 MAX_ID++;
             })
            .fail(function() {
                 console.log("failed");
            })
            .always(function() {
                 console.log("complete");
            });
    };

    // Get branch info from github
    var getBranches = function() {
	request = $.ajax({
            type:     "GET",
            dataType: "json",
            url:      BASE_GITHUB_URL + "/branches" 
        });

        request.done(function(response, textStatus, jqXHR) {
    	    $.each(response, function(index, value) {
		// Get head id
                if (value.name == "baseline-branch") {
                    HEAD_ID = value.commit.sha;
		}
	    });

	    // Loop to get branch details
    	    $.each(response, function(index, value) {
                if (value != null) {
                    url = BASE_GITHUB_URL + "/branches/" + value.name;
                    getEachBranchDetails(url);
                }
                console.log(index+ " " +value.name + " " + value.commit.url);
            });
        });

        request.fail(function(jqXHR, textStatus, errorThrown) {
            console.log("error: " + errorThrown);
        });
    };

    getBranches();

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

    $("tbody").on('click', "tr", function() {
	// Get branch name, and put the branch from field.
	branch_name = $(this).find('td:nth-child(3)').text();
        $("#branch-from").val(branch_name);	
        console.log(branch_name); 
    });
});
