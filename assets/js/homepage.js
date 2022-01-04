var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user){
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    fetch(apiUrl)
    .then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                displayRepos(data,user);
            });
        }
        else
            alert("Error: Github user not found");
    })
    .catch(function(error){
        alert("unable to connect to github")
    });
}

var formSubmitHandler = function(event){
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();
    if(username){
        getUserRepos(username);
        nameInputEl.value = "";
    }
    else {
        alert("Please enter github username");
    }
}

var displayRepos = function(repos, searchTerm){
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //check if api has any repos to it
    if(repos.length === 0){
        repoContainerEl.textContent = "No repositories found";
        return;
    }

    //loop over repos
    for (let i = 0; i < repos.length; i++) {
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href","./single-repo.html?repo=" + repoName);
        repoEl.setAttribute("target","_blank");

         // create a span element to hold repository name
         var titleEl = document.createElement("span");
         titleEl.textContent = repoName;

         repoEl.appendChild(titleEl);

         //create status element
         var statusEl = document.createElement("span");
         statusEl.classList = "flex-row align-center";

         //check if current element has issues or not
         if(repos[i].open_issues_count > 0)
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        else
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";

         //append to container
         repoEl.appendChild(statusEl);
         repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit",formSubmitHandler);