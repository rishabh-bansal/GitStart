# How To Install Git on Ubuntu 18.04 LTS

(Linux)

Git is a SCM (Source Control Management System). Git is used in the
Management of changes to documents, programs, and other information
stored as computer files. Its first usage have been for Linux and for Git
itself. It is open source and free. In this post we will see How To Install Git
on Ubuntu 18.04 LTS (Linux).

## Step 1 # Install git

`sudo apt-get update`

`sudo apt-get install git`

Confirm Git the installation . run the following command to verify which


version of git is installed.
To get help run the following command in command line: (where verb =
config, add, commit, etc.)


## Step 2 # Set Up and configure Git

After the installation of git it is advisable to do some basic git configuration.
This configuration will be helpful when you will commit your code. After
this basic git configuration helps to generate the infomation about the
person who have commited the code.
By running the following commands you can set these config options in Git.


`git config --global user.name "your name"`

`git config --global user.email "your.email@example.com"`

Quick trick about line endings: Windows:

`git config --global core.autocrlf true`

Mac/Linux:

`git config --global core.autocrlf input`

We can view all the configuration that have been done by providing
following commands:
***
# Creating our first repository and Commit code using git.


Creating our first repository :

`mkdir git_test`

`cd git_test`

`git init` //git initialise

you will observe the .git directory is created
Let’s Add a file, make some changes, and run git status
To check the status of git provide the following command
Let’s commit a file into the repo:

`git add HelloWorld.java`

`git commit -m "My very first commit"`

`git status` //show some status about  recently changed files


other commands

` git clone (url)` // clone a repo from remote

 `git add (file names)` //add files to commit

 `git commit -m "(committed message)"` //commit messsage

 `git push -u origin master ` //push to remote repo

 `git remote add origin master (url)` add url of remote repo to local git

### Understand Git Difference

`git diff`

### Git Recovery and retrieval undo

`git checkout -- hello.text`

### Git Log
`git log`
### Git
> https://www.youtube.com/watch?v=ZMgLZUYd8Cw


# Merging Local Repo With newly created remote repo (both having no connections)

`git remote add origin <remote repo url>`


`git pull <remote repo url>` //files with same name will be abort the process

`git branch --set-upstream-to=origin/master master`

`git pull` //produce an output 'Already up to date' if its success
