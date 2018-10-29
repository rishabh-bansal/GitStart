##Usage

The primary reason for rebasing is to maintain a linear project history. For example, consider a situation where the master branch has progressed since you started working on a feature branch. You want to get the latest updates to the master branch in your feature branch, but you want to keep your branch's history clean so it appears as if you've been working off the latest master branch. This gives the later benefit of a clean merge of your feature branch back into the master branch. Why do we want to maintain a "clean history"? The benefits of having a clean history become tangible when performing Git operations to investigate the introduction of a regression. A more real-world scenario would be:

1. A bug is identified in the master branch. A feature that was working successfully is now broken.
2. A developer examines the history of the master branch using git log because of the "clean history" the developer is quickly able to reason about the history of the project.
3. The developer can not identify when the bug was introduced using git log so the developer executes a git bisect.
4. Because the git history is clean, git bisect has a refined set of commits to compare when looking for the regression. The developer quickly finds the commit that introduced the bug and is able to act accordingly.


##Reword other commit messages

Let’s say I want to reword any of the last 3 commits of this repository. I then run git rebase -i HEAD~3, and here is what I see:
```
pick 46a2a0b Create hemant.md
pick 65a6abe Create first
pick f754623 Added Praveen's Details

# Rebase 014638e..a0e0e84 onto 014638e (3 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

We see the three last commits, from older to newer. See the comment below the list of commits? Good job explaining, git! pick (p for short) is the default action. In this case it would reapply the commit as is, no changes in its contents or message. Saving (and executing) this file would make no changes to the repository.

If I say reword (r for short) in a commit I want to edit:

```
pick 46a2a0b Create hemant.md
r 65a6abe Create first
pick f754623 Added Praveen's Details
```


When I save and quit the editor, git will follow the described commands, landing myself into the editor again, as if I had amended commit 3e7ee36. I edit that commit message, save and quit the editor, and here is the output:

```
[detached HEAD 8107b94] Create first REWORDED
 Author: Mayankkanu <44530937+Mayankkanu@users.noreply.github.com>
 1 file changed, 1 insertion(+)
 create mode 100644 first
Successfully rebased and updated refs/heads/master.
```

Now commit message “Create first REWORDED”.

#####Achievement Unlocked! You can now change the message of any commit you want. You may do so, just make sure you understand the “DANGER” section.