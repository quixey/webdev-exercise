function Project(id, type, name, branch, lastActivity) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.branch = branch;
    this.lastActivity = lastActivity;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "Training", "Patrick's experimental branch", "outdated-branch-1", new Date(2014, 6, 17, 13, 5, 842)),
    new Project(1, "Testing", "Blind test of autosuggest model", "up-to-date-branch-1", new Date(2014, 6, 21, 18, 44, 229))
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function (pj) {
    return pj.id;
}));

// Defining all the constant variables for GitHub.
var BASE_GITHUB_API_URL = 'https://api.github.com/';
var BASE_GITHUB_USER = 'quixey';
var BASE_GITHUB_REPO = 'webdev-exercise';

var GITHUB_REPO_URL = BASE_GITHUB_API_URL + 'repos/' + BASE_GITHUB_USER + '/' + BASE_GITHUB_REPO;
var GITHUB_AUTH_TOKEN = '5d55087aa1d72df2c41f03f6124cc7fb339e6398';

var $apiGithubWrapper = function (URL) {
    var url = GITHUB_REPO_URL;
    if (URL) {
        url = url.concat(URL);
    }
    url = url.concat('?access_token=' + GITHUB_AUTH_TOKEN);
    return $.ajax({type: 'GET', url: url, async: false});
};

$(function () {
    // Instead of hard-coding the master branch, we should get the default branch for the project.
    var getDefaultBranch = function () {
        var defaultBranch = '';
        $apiGithubWrapper(false).success(function (repoData) {
            defaultBranch = repoData.default_branch;
        });
        return defaultBranch
    };

    // Defining this globally to not to call default branch again and again.
    defaultBranch = getDefaultBranch();

    var loadProjects = function ($container, projects) {
        $.fn.append.apply($container, $.map(projects, function (pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.type),
                $("<td>").text(pj.name),
                $("<td>").text(pj.branch),
                $("<td>").text(calculateBranchDifference(pj.branch)),
                $("<td>").text(pj.lastActivity.toString())
            );
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function ($form) {
        return new Project(
                MAX_ID + 1,
            $form.find("#project-type").val(),
            $form.find("#project-name").val(),
            $form.find("#project-branch").val(),
            new Date()
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function ($form) {
        $form.find("#project-type").val("");
        $form.find("#project-name").val("");
        $form.find("#project-branch").val("");
        $form.find("input:first").focus();
    };

    $("#add-project-form").submit(function (e) {
        var $form = $(this);
        pj = createProject($form);
        MAX_ID = pj.id;
        CURRENT_PROJECTS.push(pj);
        loadProjects($projectTable, [pj]);
        resetForm($form);
        e.preventDefault();
    });

    // Loads all the active branches of given repo in the form.
    var loadBranchList = function ($listElem) {
        $apiGithubWrapper('/branches').success(function (branches) {
            $.each(branches, function (index, item) {
                $listElem.append(
                    $("<option>").text(item.name)
                );
            });
        });
    };

    // The latest commit of given Branch. (Using it to compare two branches)
    var getBranchCommit = function (branchName) {
        var branchCommit = '';
        $apiGithubWrapper('/branches/' + branchName).success(function (branchData) {
            branchCommit = branchData.commit.sha;
        });
        return branchCommit
    };

    // Calculate Difference in branches.
    var calculateBranchDifference = function (childBranch) {
        var statsString = '';
        if (defaultBranch === childBranch) {
            return 'Default Branch';
        }
        var baseBranchCommit = getBranchCommit(defaultBranch);
        var childBranchCommit = getBranchCommit(childBranch);

        $apiGithubWrapper('/compare/' + baseBranchCommit + '...' + childBranchCommit).success(function (stats) {
            statsString = stats.status.toUpperCase() + ' | ';
            if (stats.ahead_by)
                statsString = statsString.concat(stats.ahead_by + ' Commit Ahead. ');
            if (stats.behind_by)
                statsString = statsString.concat(stats.behind_by + ' Commit Behind.');

        });
        return statsString;
    };

    var $projectTable = $("#project-list>tbody");
    loadProjects($projectTable, CURRENT_PROJECTS);

    var $branchList = $("#branch-list");
    loadBranchList($branchList);
});
