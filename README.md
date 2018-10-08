# Welcome to GitHub!
## This project is perfect for your first pull request

# Welcome to Open Source

## What is PR?

PR stands for Pull Request. By making a PR, you are basically notifying the repository maintainers that you have worked on a piece of code that you want to add to the project and the maintainers can then review it and add it to the project.

Since you cannot make the changes yourself, you are **Requesting** them to **Pull** the changes since only they have the priveleges to do so.

``` 
Congratulations You now know the magic that runs the majority of open source projects 
```

## But wait, what project?? You mentioned repository, maintainer. What's all that????

**Repository** or **Repo** is a storage space/directory for your projects. So, On Github Projects have their own repository which curates the entire codebase and adds many functionalities like addressing issues in code, managing PR's, looking into different branches.

**Maintainers** are certain people/users that manage that codebase. They look into working of that code, reviewing PR's, helping people if they are stuck at solving any issue and a lot lot more. 

Open Source is by community and for community. You will find amazing set of people to learn from here.

## Half of things above brushed past my head :(. Don't worry You will learn by time. So let's begin with the basics.

# Make Your First Pull Request

1. Create Github account. It's free!!! and it's really popular, many organisations rely on Github for maintaining their repositories.
2. Fork this repository

   On top right of this page, You will find a Fork button. Press it. If asked where to fork to, choose your user ( @ "your-username" )
3. Clone that Forked Repo locally i.e. to your Computer/Laptop

   When you open the forked repo on you Github profile i.e. when you open Repositories tab and click on
   ```Learn_To_make_a_PR```
   You will see a bright green button on right with label as **Clone or Download**.
   Either copy the web URL and at the desired location on your system , open terminal there and write
   ```
   git clone <copied-url-here>
   ```
   or
   Download ZIP there
4. ``cd`` into that branch i.e. change the current working directory to that folder
5. Create a new branch for whatever you want to do to this code. (You can read up on Branches online)
```
git checkout -b new-branch-name-here
```
This will create the new branch with whatever you wrote inplace of *new-branch-name-here* and also change current branch to that branch

**Note: In Terminal, Write ```git status``` and see what you get**

6. In Directory named 'students' add your profile page

   Don't be scared!!! It's not difficult.
   Create a new text file with name as *your-name.txt*

   ```In case this filename already exists, change yours a little```

   In the file write your name and whatever else you want to and save the file.

**Note: Again In Terminal, Write ```git status``` and see what you get**

7. Since this is introductory PR,we can add all the untracked files by typing 
```
git add -A
```

(In case you do not understand what this is!! Don't worry we will teach that later)

8. Commit this

```
git commit -m "Added profile page for <yourname here"
```

9. Push this to your remote forked repo in your account

```
git push origin the-branch-name-you-wrote-above
```

**Note: In case you forgot branch-name, in terminal (the command line) write
```
git branch -v
```
you can see your branch name with a * to the left of it

As per your git setup, it might ask for your username and password, provide it.

Don't hesitate to read about it online first :D before entering these details.

10. Open your forked repo, you will see something like 
```
This branch is ahead .....
```
and a beautifull option of **Pull Request** on right. Press it.

You will be redirected to a new page, Press the Green Create Pull Request button and Create your first Pull Request.

**Congratulations!! You just made your first pull request. Welcome to the world of infinite opportunities. !!!!**

> **Happy Coding!!**

11. Wait for the PR to merge. It may take time but every PR counts....

12. Star this Repo too. xD


Read about markdown syntax here
https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
