import React from 'react'
import Link from 'gatsby-link'
import Code from '../components/syntax'

const IndexPage = () => (
  <div>
    <h1>Hello Developers! &nbsp;<i className="em em-wave"></i></h1>
    <h3>Let's help you submit your first Pull Request.</h3>
    <p>Once your pull request is being merged, your profile will be visible in the <Link to="/submissions/">Submissions </Link>
    section of this page. For this exercise you'll be adding a new entry to the source code of this website with your profile details. 
      Excited? <i className="em em-grinning_face_with_star_eyes"></i> let's begin!
    </p>
    
    <h3>Step 1</h3>
    <p>
      Goto the <a target="_blank" href="https://github.com/rishabh-bansal/GitStart"> GitHub repository </a> of this project and fork the project to your account. <i className="em em-knife_fork_plate"></i>
       Click on the fork button on the top right corner of the repository page to do it. Once done, GitHub will take you to the forked copy in your account.
      <Code code="https://github.com/rishabh-bansal/GitStart"/>
    </p>
    <h3>Step 2</h3>
    <p>
      Clone the forked repository to your local machine. Click on the big green button saying "Clone or download" and copy the https url of your repository.
      Fire up the terminal (on linux systems ctrl+alt+t. on Windows open the <a target="_blank" href="https://git-scm.com/download/win">Git-bash</a> ) navigate to your desired directory and type the following command. Replace the link with the clone URL of your repository and hit Enter.
      <Code code="git clone https://github.com/YOUR_USERNAME/GitStart.git"/>
    </p>
    <h3>Step 3</h3>
    <p>
      Let's start working on the changes required now! First cd into the cloned folder by typing the following command.
      <Code code="cd GitStart"/>
      Now, Before jumping in to the code, make sure you're working on a different branch and not in master. To create a new branch, 
      from the terminal inside your current project directory type the following command.
      <Code code="git branch YOUR_USERNAME-profile"/>
      Replace the <i>YOUR_USERNAME</i> with your GitHub username or you can give any name to your branch which describes the purpose of the branch. Since here we're adding your profile,
      we'll simply give the name of the branch as above. eg: <i>git branch rishabh-bansal-profile</i>. Once you have created the new branch we'll change the current branch from master to your newly created branch.
      Execute the following command on your terminal.
      <Code code="git checkout YOUR_BRANCH_NAME"/>
    </p>
    <h3>Step 4</h3>
    <p>
      In your <i className="em em-card_file_box"></i> file manager/terminal navigate to the downloaded repo. Open the sub-directory <i className="em em-file_folder"></i><b>src/profiles/</b>. and create a new <b>.md</b> file with your username as the filename with <b>.md</b> extension.<br/>
      It should look like <b>YOUR_USER_NAME.md</b> <i>eg: rishabh-bansal.md </i><br/>
      Open this file in your favourite editor and fill the details as below in the frontmatter of the markdown file.
      <br/>
      <i className="em em-page_facing_up"></i><i>YOUR_USER_NAME.md</i>
      <p className="code">
      ---<br/>
      username: YOUR_USER_NAME<br/>
      fullname: YOUR_FULL_NAME<br/>
      ---
      </p>
      <p>
        Donot forget that the hyphens "---" are also part of the file. Once you finish adding the content, save the file.
      </p>
    </p>
    <h3>Step 5</h3>
    <p>
      Commit the changes with a suitable commit message.<i className="em em-white_check_mark"></i> First we need to stage all the changes we made. Open the terminal inside the project directory and execute following commands.
      <Code code="git add -A"/>
      The above command stages all the changes, now lets commit it with a suitable message.
      <Code code='git commit -m "YOUR_COMMIT_MESSAGE"'/>
    </p>
    <h3>Step 6</h3>
    <p>
      Let's push the changes to your repository!<i className="em em-arrow_up"></i> execute the following command to push all the changes to the forked copy in your GitHub account.
      <Code code="git push -u origin YOUR_BRANCH_NAME"/>
    </p>
    <h3>Step 7</h3>
    <p>
      Now, open your web browser and goto the <a target="_blank" href="https://github.com/rishabh-bansal/GitStart"> original repository on GitHub</a>. If your changes has been pushed to your forked copy, You'll be able to see an option saying "New Pull Request" in the original repository.
      Click on the option, one next page choose the master branch of the main repo against your created-branch name ( choose your branch name we created and not master). the click on create pull request. Once you fill in the commit message and comment click on submit pull request. <br/>
      and you are all done! <i className="em em-confetti_ball"></i> Wait for a reviewer to review your file and merge it to the master. Once its been successfully merged, your profile will be visible in the submissions tab. <i className="em em-trophy"></i>
    </p>
  </div>
)

export default IndexPage
