* Navigate to the repo on GitHub.
* Click on the 'Fork' button in the top right corner. GitHub will take some time to fork the repo.
* Navigate to the forked repo. Should be like https://github.com/<your_github_username>/<repository name>
* Click on the green color 'Clone or download' button
* Copy the command given in the text box. Should be like https://github.com/<your_github_username>/<repository name>.git
* Clone it on your local machine using the command git clone https://github.com/<your_github_username>/<repository name>.git
* Navigate to the cloned directory cd <repository name>
* Create a new branch using git checkout -b <your_branch_name>
* Change the required file locally.
* Commit your changes using git add . and git commit -m "<your_message>"
* Push your local branch to your GitHub repo git push --set-upstream origin <your_branch_name>
* Go to your GitHub repo on a browser, you will see a notification asking to create a PR.
* Click on the Create Pull Request button, Give a meaningful title to the PR.
* And you're done. 😄
