# Add your Git Tutorials here!

CEO-chris Wanstrath
Projects on GitHub can be accessed and manipulated using the standard Git command-line interface and all of the standard Git commands work with it. 
GitHub also allows registered and non-registered users to browse public repositories on the site.
GitHub is a web-based Git or version control repository and Internet hosting service.
Thank famed software developer Linus Torvalds for Git, the software that runs at the heart of GitHub,the same person who created Linux.
Git keeps a “snapshot” of every change ever made.

Git is a version control system (VCS) for tracking changes in computer files and coordinating work on those files among multiple people. 
It is primarily used for software development, but it can be used to keep track of changes in any files.

A Working Directory: where you'll be doing all the work: creating, editing, deleting and organizing files  (local computer)
A Staging Area: where you'll list changes you make to the working directory
Repository : A repository is a folder inside which you are going to store every piece of your code.
where Git permanently stores those changes as different versions of the project
Fork : Copying someones repository into your account is called forking.
Upstream : The guy or organisation which owns the code that you forked.

This is where the Git magic comes.  
    1. Git lets you save your code online.
    2. Git will allow all the developers of a project to see what changes the  other one has made.
    3. It allows you to discuss issues in your code with other developers.
....
cmd-
//Git bash
 git --version  //show the details of version
 git config --global user.name "sunny"  //To add username
 git config --global user.email "sunnyvales789@gmail.com"  //to add email
 git config --list  //get settings detail
 git config user.email  //find user email address
 git help  //to get gelp in any command
 git help commit  //suppose you need help in this command then type this command and it opens html files
//Cmd
git version
---------------git help
start a working area (see also: git help tutorial)
   clone      Clone a repository into a new directory
   init       Create an empty Git repository or reinitialize an existing one

work on the current change (see also: git help everyday)
   add        Add file contents to the index
   mv         Move or rename a file, a directory, or a symlink
   reset      Reset current HEAD to the specified state
   rm         Remove files from the working tree and from the index

examine the history and state (see also: git help revisions)
   bisect     Use binary search to find the commit that introduced a bug
   grep       Print lines matching a pattern
   log        Show commit logs
   show       Show various types of objects
   status     Show the working tree status

grow, mark and tweak your common history
   branch     List, create, or delete branches
   checkout   Switch branches or restore working tree files
   commit     Record changes to the repository
   diff       Show changes between commits, commit and working tree, etc
   merge      Join two or more development histories together
   rebase     Reapply commits on top of another base tip
   tag        Create, list, delete or verify a tag object signed with GPG

collaborate (see also: git help workflows)
   fetch      Download objects and refs from another repository
   pull       Fetch from and integrate with another repository or a local branch
   push       Update remote refs along with associated objects

'git help -a' and 'git help -g' list available subcommands and some
concept guides. See 'git help <command>' or 'git help <concept>'
to read about a specific subcommand or concept.
----------------------------------------------------
Navigating to folder-
 pwd     //current location file
 cd ..  //back
 ls  //list
 cd Sunnyvale //move to this folder Sunnyvale
 git init  //initialize to make it git repositery
 ls -la //show hidden files             Note-ls cmd is not working in windows it only works on mac and unix.
.............
So suppose now we are in tuna folder which is present on desktop.[git add . adds all modified and new (untracked) files in the current directory and all subdirectories to the staging area]
 git add .    //To add any file in this folder
......
 git commit -m "This is my first commit"    //save it
o/p-
[master (root-commit) b707579] This is my first commit
 1 file changed, 1 insertion(+)
 create mode 100644 first.txt
..............
 git commit -m "This is my first commit"  //if there is change come in this file and u not saved it then it show this message
o/p-
On branch master
Changes not staged for commit:
        modified:   first.txt

no changes added to commit
-------------------------
q1-how to properly commit after changes- by again typing cmd >git add .
..............
 git log
 git log --author="sunny"
 git log --author=="qertt"
............
 git status
o/p-
On branch master
nothing to commit, working tree clean
....
 git status
o/p-
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        seond.txt
        third.txt
nothing added to commit but untracked files present (use "git add" to track)
..........
 git add seond.txt
 git status
o/p-
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   seond.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        third.txt
//now it enters into the staging area
working directory>staging area>repository   //git overflow
 git commit -m "this is second commit"
..............
How to Edit files
Viewing changes that you made
This is done after commit
> git diff
red colour-your original content
green colour -you change about to make
...............
if the file is present in stagging area(means you use this cmd git add first.txt) then git diff command will not work
for this you need to use
 >git diff --staged
.................
How to delete files-
 git rm third.txt   //delete repository files
...............
How to move and rename files-
 git mv seond.txt second.txt   //rename file
 git mv first.txt love/pp.txt   //move to love folder
...........
 Editing and modifying fies in git
git commit -am "this submait many files" 
....................
To back in the condition which it is
 git checkout -- index.html
back it to that text
........
remove the file from staging area-
 git reset HEAD profile.html
 .............
 git remote add githubrepo https://github.com/sunny7899/AndroidAppDemo.git //upload these files to github
 git remote   //gives repositery name
 git push -u githubrepo master   //upload files of tuna folder  to github
..........
Software-
https://desktop.github.com/
.......
2 commit in github means you made 2 changes.
branches
git branch cats.//for new branch
...............
project code-
raw
blame 
history
watch-(follow this)--notification
star-bookmark
wiki-any material you have
........
$ git clone <add the repository address here>
( Clones/copies everything from that repository to your local machine )
$ git add filename.extension
(this adds the file you want to change on the server)
$ git commit
(this commits your changes to the repository with an explanation message)
$ git push origin master
  

