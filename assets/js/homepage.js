var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
    // make a request to the url use fetch to link to the url and use json to responses back the info from server
    fetch(apiUrl)
    .then(function(response) {
        // check for user input errors which the user name searched does not exist
        // check if the response status is ok or not, if ok, run the function and use json to return the info from server
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
        });
        // if not ok, in here is error 404 which means info not found, happens when user entered invalid user name to search. display the error alert
       } else {
           alert("Error: " + response.statusText);
       }
    })
    // the Fetch API's way of handling network errors
   .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    /* in here which fetch() api, it requests the info from server, if the request get returns successfully, then it into .then() method. 
      if the request is fails, the error will be sent to the .catch() method*/
    alert("Unable to connect to GitHub");
  });
};


var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

// show all the repo under the user name we searched
var displayRepos = function(repos, searchTerm) {
    // clear old content, always clear the old repos info before a new search
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos, if the repos is empty or not
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos, create repos info which will show on the right-side of the webpage with list of the repos under the user name we searched
    for (var i=0; i<repos.length; i++) {
        /* format repo name // the info is from the github repos link with fetch contain, from the server in here
        check https://api.github.com/users/octocat/repos */
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        // in here we create an a element with href url to connect to the issue list page.
        var repoEl = document.createElement("a");
        repoEl.classList="list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container // add the repos name to div element created above which store the repos name
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList="flex-row align-center";

        // check if current repos has issues or not
        if (repos[i].open_issues_count >0) {  
            // if the repos has issues, sure the icon of cross and number of issues outstanding
            // the open_issue_count info from https://api.github.com/users/octocat/repos
            statusEl.innerHTML= "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";            
        } else {
            // if the repos doesn't have issues, show the check mark
            // the open_issue_count info from https://api.github.com/users/octocat/repos
            statusEl.innerHTML="<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container // add the repos issue status info to repoEl whom contains the repos info
        repoEl.appendChild(statusEl);

        // append container to the dom // add the repo info to the repos container where show the repos info in HTML
        repoContainerEl.appendChild(repoEl);
    }
    console.log(repos);
    console.log(searchTerm);
}

// add the feature to search different programming language repo
var getFeaturedRepos = function(language) {
    // request send to the url from github to search the featured repo
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // check if the response successfully returned, if yes, run the JSON to get the data
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {  
            // if not, display the error message
            alert("Error: " + response.statusText);
        }
    })
};


// add the button click handler
var buttonClickHandler = function(event) {
    // created a variable to get the data-language attribute from the button elements in HTML when we click the button
    var language = event.target.getAttribute("data-language");

    if (language) {
        // call this getFeaturedRepos() function and pass the value we get from data-language as an argument
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent="";
    }
    console.log(language);
}

languageButtonsEl.addEventListener("click", buttonClickHandler);