var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


/* this function is getting the repo name for the issues list page
    we use document.location.search to get the repo name in query parameter form as 
    "?repo=facebook/Ax", we use split method to separate the parameter into to two part from "="
    store in an array, then get the second part back. call it in getRepoIssues function and
    return the repo name on the top page of the issue listing page */
var getRepoName = function() {
    // create a variable for query string which use location web api to locate the repo location
    var queryString = document.location.search;
    
    // split the location to two part and return the second part of the info
    var repoName = queryString.split("=")[1];

    // to check if the repo name does exist, if yes, run the name
    if(repoName) {
        // append the repo name to the issue list webpage
        repoNameEl.textContent = repoName;
        /* pass the repoName variable into the getRepoIssues() function, which will use the repoName 
        to fetch the related issues from the GitHub API issues endpoint */
        getRepoIssues(repoName);
        // if the name is not exist, redirect the user back to the main page
    } else {
        document.location.replace("./index.html");
    }    
};


var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        // check if the request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                /* github api only can show 30 issues at the time, so we need to check if there are more an 30 issues 
                   so we can redirect the user to actual github issue page*/
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            document.location.replace("./index.html");
        }
    })
};

// the list to show all the issues in the repo up to 30 issues
var displayIssues = function(issues) {
    // check if the repos has an issue
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i=0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // in here this .html_url is from the info json pushed back example check https://api.github.com/users/octocat/repos
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        // again the title information from the info json pushed back example check https://api.github.com/users/octocat/repos
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append the titleEl to the container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append the typeEl to the container
        issueEl.appendChild(typeEl);

        // add the issue list to the actual webpage
        issueContainerEl.appendChild(issueEl);
    }
}

// warning message to the user and advise there are more than 30 issues in the repo which can't show on the page
var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // append the link element with an href attribute
    var linkEl =  document.createElement("a");
    linkEl.textContent= "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to the warning container on the webpage
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
