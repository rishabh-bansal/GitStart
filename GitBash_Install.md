# Install Git on Windows


1.Download the latest Git for Windows installer.(https://git-for-windows.github.io/)

2.When you've successfully started the installer, you should see the #### Git Setup wizard screen. Follow the Next and Finish prompts to complete the installation. The default options are pretty sensible for most users.

3. Open a Command Prompt (or Git Bash if during installation you elected not to use Git from the Windows Command Prompt).

4. Run the following commands to configure your Git username and email using the following commands, replacing Emma's name with your own. These details will be associated with any commits that you create:

```
$ git config --global user.name "Emma Paris"
$ git config --global user.email "eparis@atlassian.com"
```

5. You are done . 
#Installing Git on Ubuntu 16.04 LTS
Pre-Flight Check

    You should be running a server with any Ubuntu 16.04 LTS release.
    You will need to log in to SSH via the root user.
    In this tutorial I’ll be working with a Core Managed Ubuntu 16.04.4 LTS server

First, as always, we should start out by running general OS and package updates. On Ubuntu we’ll do this by running:
apt-get update

After you have run the general updates on the server you can get started with installing Git.

    Install Git
    apt-get install git-core
    You may be asked to confirm the download and installation; simply enter y to confirm. It’s that simple, git should be installed and ready to use!
    Confirm Git the installation
    With the main installation done, first check to ensure the executable file is setup and accessible. The best way to do this is simply to run git with the version command.
    git --version

    git version 2.7.4

    Configure Git’s settings (for the root user)
    It’s a good idea to setup your user for git now, to prevent any commit errors later. We’ll setup the user testuser with the e-mail address testuser@example.com.

    git config --global user.name "testuser"
    git config --global user.email "testuser@example.com"

    Note:
    It’s important to know that git configs work on a user by user basis. For example if you have a ‘david’ Linux user and they will be working with git then David should run the same commands from his user account. By doing this the commits made by the ‘david’ Linux user will be done under his details in git.
    Verify the Config changes
    Now we’ll verify the configuration changes by viewing the .gitconfig file. You can do this a few ways, we’ll show you both methods here.

        View the config file using cat with the following command:
        cat ~/.gitconfig
        Or, you can also view the same details using the git config command:
        git config --list

And that’s it! You have now installed Git on your Ubuntu 16.04 LTS se
u r done
