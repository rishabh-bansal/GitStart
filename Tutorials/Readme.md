stpe 1:CREATE AND CLONE:

create new repository _________git init
clone local repository_________git clone/path/to/repository
clone remote repository________git clone username@host:/path/to/repository

stpe 2:ADD AND REMOVE:

add changes to INDEX________git add <filename>
add all changes to INDEX_______git add*
remove/delete_______git rm <filename>

stpe 3:COMMIT AND SYNCHRONIZE:

commit changes________git commit -m "Commit message"
push changes to remote repository_______git push origin master
connect local repository to remote repository______git remote add origin <server>
update local repository with remote changes_______git pull

stpe 4:BRANCHES:

create new branch_______git checkout -b <branch>
switch to master branch________git checkout master
delete branch________git branch -d <branch>
push branch to remote repository____git push origin <branch>

stpe 5:MERGE:

merge changes from another branch_______git merge <branch>
view changes between two branches______git diff <source_branch> <target_branch>

stpe 6:TAGGING:

create tag____git tag <tag> <commit ID>
get commit IDs_____git log

stpe 7:RESTORE:
replace working copy with latest from HEAD______git checkout--<filename>


