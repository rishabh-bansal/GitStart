# Add your Git Tutorials here!

##Basic Git CheatSheet

#### Git basic workflow
* git init
* Git has 3 stages: working directory(where we do the work), staging area(where we list changes to be tracked) and repository(where git actually stores those changes as different versions of the project).
* git status: gives us info about which files are not being tracked etc
* git add filename: With this we mention that we want filename to be tracked by git.
* git diff filename: With this we can see the changes in file.
* git commit -m "message"
* git log: is a command which lists all of our previous commits. This is what it contains:
    - A 40-character code, called a SHA, that uniquely identifies the commit. This appears in orange text.
    - The commit author (you!)
    - The date and time of the commit
    - The commit message

---

#### Git Backtracking


* The commit you are currently on is called as HEAD commit. In many cases, the most recently made commit is the HEAD commit. Use "git show HEAD"
* git checkout HEAD filename: is a command that will restore the file filename back to its original state as it was before commit HEAD
* git reset HEAD filename: This command resets the file in the staging area to be the same as the HEAD commit. It does not discard file changes from the working directory, 
  it just removes them from the staging area. This command lets us untrack files in staging area.
* git reset 5d69206: HEAD is now set to that previous commit whose SHA's 1st 7 letters are 5d69206.

---

#### Git Branching

* Up to now we used only single branch called master.
* git branch: This command tells us which branch we are currently on.
* git branch fencing: This would create a new branch called fencing.
* git checkout fencing: This command would let us switch to fencing branch.
* git merge fencing: Would let us merge fencing branch to master branch.
* However there maybe some merge conflicts, so you have to resolve them before git merging branches.
* git branch -d fencing: would delete the branch fencing.

---

#### Git Teamwork

* git clone remote_location clone_name
* git remote add origin url: this will create a remote in the current local directory. Very important
* Once we clone, git calls this remote location as the origin. You can check it by using git remote -v command.
* git fetch: This command will update your local copy and fetch all the changes that have been made by others.
* When you fetch, those changes are in origin/master branch. In order to actually work with them, there is another step involved that is to merge them with your local master branch. To do this use this command: 
  git merge origin/master
* git pull = git fetch + git merge
* Git workflow: This is how things usually go
    - Fetch and merge changes from the remote
    - Create a branch to work on a new project feature
    - Develop the feature on your branch and commit your work
    - Fetch and merge from the remote again (in case new commits were made while you were working)
    - Push your branch up to the remote for review
* git push origin branch_name: This command will push your branch code to the origin(or the remote location)

---

#### Git Create new website

* git branch: lists all the branches that you have
* git checkout --orphan master: create a master branch if you dont have one
* git rm -rf . and rm '.gitignore': Remove all content from old working directory
* Add content(html or whatever in the directory) and push
* git push origin master



---
#### Extra Info

* git reset --hard SHA : This takes your local repo back to SHA commit.
	- Now if git push to remote doesnt work use: git push -f origin master. This basically rewrites github commit history


