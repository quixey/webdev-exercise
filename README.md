Quixey web development exercise
===============================

* [About this repo](#about-this-repo)
* [Your task](#your-task)
* [Notes and resources](#notes-and-resources)
* [Afterward](#afterward)

Hi! If you're here then you are probably interested in working for [Quixey](https://quixey.com/careers). We set up this exercise so that our candidates could have a clear way to demonstrate their front-end-web-dev ability in a realistic way that (hopefully) isn't too stressful or time-consuming.

Ideally, this exercise should probably take around an hour for you to do a good job, or maybe a little more if you need to brush up on front-end tools or git. If you want to spend more time to add bells and whistles, then that's great, and you'll get bonus points from us if you do it well, but please don't feel like you have to spend half a day on it.

About this repo
---------------

This repository is set up to simulate the front end of a small internal tool, like the kind you might realistically be working on. The best way to run it will be to fork & clone this repository and serve it from your local machine; for example, if you have Python installed, you can serve it like

```sh
$ cd src
$ python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

and then visiting `http://localhost:8000` in your browser.

This tool is built to be used by internal testers at Quixey who work on projects set up by search engineers here. It shows a list of all the current projects, and has a little UI for adding new projects to the list. Each project has an ID, a name, a type (there are only a few different project types), and an activity date. (Realistically, it might load this information from a database, but for the purposes of this exercise the 'database' is just an array in `projects.js`.)

Your task
---------

You just received a feature request from some search engineers which you would like to implement. The search engineers collaborate via GitHub, and usually their projects are associated with a specific commit or topic branch in their repository.

However, sometimes the projects last a long time, and the branch that they are based on gets out of date with respect to master. (If you don't know what I mean by this, you might want to review how [git branching](http://rypress.com/tutorials/git/branches-2.html) works.) Sometimes, this is OK, but other times, this can mean that the testers are not testing the latest code, and the engineer in charge of the project wants to notice it so that they can rebase their branch on master and update the test deployment; otherwise the results might be inaccurate.

The search engineering team thinks that if you could show them in the project tool when their branch is out-of-date, then they would make many less errors during testing. One of them suggested that a good way to do it might be like this:

- Allow them to specify a commit or branch or tag that goes along with a particular project.
- Talk to the GitHub API to figure out whether or not each project is up-to-date with master.
- Add a UI element to the project list that helps them see which projects are OK and which need updating.

If you agree that this is a good idea, then you should give it a shot and implement it. (If you don't, then prepare to argue for your better idea!)

Notes and resources
-------------------

Here are some helpful sections of the documentation for the GitHub API:

- [Overview](https://developer.github.com/v3/)
- [Repositories](https://developer.github.com/v3/repos/)
- [Commits](https://developer.github.com/v3/repos/commits/)

Note that you can access the GitHub API and ask queries about public repositories (like this one!) without any authentication, but there's a rate limit of 60 queries per hour. If you run into the rate limit, then you can [authenticate via HTTP basic authentication or an OAuth token for your account](https://developer.github.com/v3/#authentication) to up the limit to 5000.

Please use any online resources you like, or ask anyone questions, but clearly attribute any code which isn't your own. (And we'll probably ask you some questions about what you did, so it won't be advisable to write something you don't understand.)

If you think it would be helpful to write some backend code or anything else we didn't anticipate, feel free to write it using whatever languages, libraries, and tools you think are a good fit for the task.

Qualities we're looking for in your solution:

- You should solve the stated problem well for users of the tool
- Your work is clear, concise, correct, maintainable, and the code is appropriately efficient
- Code and UI that you add should be consistent with the existing codebase and interface
- Design decisions you make are clearly thought-through

Afterward
---------

After you're finished, please let us know and either:

- (Ideal) Make a pull request from your forked repo for your changes
- (Also OK) Link us to your code, or send us your code via email.

If you have any feedback, please let us know; we care about making sure that our interview process doesn't suck for you and does a fair job of assessing your skill. Thanks for taking the time to do this!
