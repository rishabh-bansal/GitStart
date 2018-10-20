# git Cheatsheet
1. create a new empty repo ```git init``` and enterb your project info.
2. or you can clone a existing repo  by ```git clone ssh://<user@domain.com>/<repo>.git ```
3. once you done clonning start making changes you want
4. create a ```.gitignore``` file  add the file/folder names which you don't want to track.
5. check changed files in working directory ``` git status ```
6. check chages made to tracked files(which are not in .gitignore) ``` git diff ```
7. add your project files by ```git add <file name> ``` or add all files ```git add .``` 
8. commit your files describing what you change ``` git commit -m "your description" ```
9. check all the commits you made in past ``` git logs```
10. to check changes over specific file ``` git log -p <file name>```
11. to check who and when made changes ```git blame <file name>```
12. list all brances in project ```git branch -av ```
13. create a new branch ```git branch <branch-name>```
14. goto newly created branch ``` git checkout <created branch name>```
15. delete a branch ```git branch -d <branch-name> ```
16. list all currently configured remotes ```git remote -v```
17. add new remote repo named <remote> ```git add remote <name> <url>```
18. publish local changes ``` git push remote <branch>```
19. merge branch with Head ``` git merge <branch>```  
