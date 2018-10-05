# Getting started with git

## Installation
First you would need to install local git CLI according to your Operating system from [here](https://git-scm.com/downloads).

## Cloning a repsoitory
If you want to clone any repository the you can do so by clicking on the green colored clone or download button on the top right hand corner and copying he URL.

Then you can clone the repository by running the following command -

`git clone <--The URL you just copied-->`

## Creating a local repository
First of all you would need to create a local repository inside the working folder of your project.

`git init`

After that you would need to add those changes you made to the local repository. You can do this by running the following command -

`git add .`

Then you need to commit those changes in your local repository by running the following command -

`git commit -m "<--Write you commit message here-->"`


## Pushing changes to the remote repository
First create a new repository on github by clicking on the + button on the top right hand corner and copy the URL.

Then you would need to add the the remote origin to your local repository- 

`git remote add origin <--URL to your git repository-->`

After that you can push these changes to github by runiing the following command.

`git push origin master`