import React from 'react'
import Link from 'gatsby-link'
import Code from '../components/syntax'

const CheatSheet = () => (
  <div>
    <h2>Create &nbsp;<i className="em em-sparkles"></i></h2>
    <p>
      Clone an existing repository
      <Code code="$ git clone ssh://userdomain.com/repo.git"/>
    </p>
    <p>
      Create a new local repository
      <Code code="$ git init"/>
    </p>
    <h2>Local Changes &nbsp;<i className="em em-house_with_garden"></i></h2>
    <p>
      View changed files in working directory
      <Code code="$ git status"/>
    </p>
    <p>
      Add all current changes to next commit
      <Code code="$ git add ."/>
    </p>
    <p>
      Add some changes to next commit
      <Code code="$ git add -p <file>"/>
    </p>
    <p>
      Commit previously staged changes with message
      <Code code="$ git commit -m 'message'"/>
    </p>
    <h2>Commit history &nbsp;<i className="em em-book"></i></h2>
    <p>
      Show all commits, starting with newest
      <Code code="$ git log"/>
    </p>
    <p>
      Show all commits with formatting and graphs
      <Code code="$ git log --pretty --graph"/>
    </p>
    <p>
      Who changed what and when in a file
      <Code code="$ git blame <file>"/>
    </p>
    <h2>Branches and tags &nbsp;<i className="em em-palm_tree"></i></h2>
    <p>
      List all existing branches
      <Code code="$ git branch -av"/>
    </p>
    <p>
      Switch HEAD branch
      <Code code="$ git checkout <branch>"/>
    </p>
    <h2>Update and publish &nbsp;<i className="em em-lower_left_fountain_pen"></i></h2>
    <p>
      List all currently configured remotes
      <Code code="$ git remote -v"/>
    </p>
    <p>
      Download changes and merge into HEAD
      <Code code="$ git pull <remote> <branch>"/>
    </p>
    <p>
      Publish local changes on a remote
      <Code code="$ git push <remote> <branch>"/>
    </p>
    <h2>Merge and rebase &nbsp;<i className="em em-raised_hands"></i></h2>
    <p>
      Merge branch into your current HEAD
      <Code code="$ git remote -v"/>
    </p>
    <p>
      Rebase your current HEAD onto branch (not for published commits)
      <Code code="$ git rebase <branch>"/>
    </p>
    <h2>Undo &nbsp;<i className="em em-rewind"></i></h2>
    <p>
      Discard all local changes in working directory
      <Code code="$ git reset --hard HEAD"/>
    </p>
    <p>
      Discard local changes in a specific file
      <Code code="$ git checkout HEAD <file>"/>
    </p>
    <p>
      Revert a commit
      <Code code="$ git revert <commit>"/>
    </p>
    <h2>Setting up profile </h2>
    <p>
      Using username
      <Code code="$ git config --global user.name \'YOUR_USERNAME\'"/>
    </p>
    <p>
      Using email
      <Code code="$ git config --global user.email YOUR_EMAIL_HERE"/>
    </p>
    <p>
      Checking you config settings
      <Code code="$ git config --list"/>
    </p>
  </div>
)

export default CheatSheet
