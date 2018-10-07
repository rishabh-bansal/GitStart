# Add your Git Tutorials here!
#Common Terms Some of the basic terms used while working with git are:

Repository : A basic folder or a collection of files that represents one project. The name of this repository is Git-Guide. When you clone, you clone an entire repository and every repository is identified by a unique URL.

Local Repository : The project folder which exists in your machine, locally. It is where you make your changes and push them to the github repository. No one can make changes to your local repository directly other than yourself, you need to sync (connect) this local repository with a repository on github (or any VCS system) in order to push and pull changes.

Remote Repository : This is the respository hosted on github (or any other VCS) to which your local repository is connected. You push your changes to this and others working on the same project can see your changes. Only those with write permissions to this repository can make direct changes to it. Many people can make changes to this repository and you can pull those changes to your local repository and push your own to this. A single local repository can be connected to multiple remote repositories. Remote repositories are referred by keywords like origin and upstream.

Fork: This is how you make a copy of a project owned by someone else. A person or organisation. Apart from the owner of the repository, no one is allowed to make direct changes to the project. So fork is used to make a copy of the project that is owned by you.

Clone: You got the project in your account, now what? A clone is just that, a copy. It does not care about ownership. It is aimed to bring the copy of the project hosted on github or any other VCS system in your machine. This is where you will make the changes and later update your remote project

Commit: This is a checkpoint in your project history. All the commits are recorded in git logs with the description provided by user. After you add, modify or remove any files, a commit is made to save these changes in history.

Push: This is how you send the changes made in your local repository to your remote. All your changes remain unsynced until you have pushed them and this is necessary step to keep the changes parallel. Only the files you commit(as in the previous definition) are pushed and rest of the changes remain local to your project.

Fetch: This is in very simple terms means to download any updates and changes from a remote repository. This does not mean that you have included the changes in your project. Just download.

Merge: This means to merge or combine updates fetched from remote repository with your local one. This may lead to merge conflicts if a change in remote is incompatible with a change in your local project.

Pull: This means to fetch any updates that may have occured in a remote branch in your local repository and merge them. This is basically a fetch followed by a merge.

Pull Request (PR): Pull Request or PR as it is generally known, is a method to contribute to open development projects by including bug fixes or adding new features. Its a way of contributing by asking the owner of project to include changes made in the external/forked repository.
