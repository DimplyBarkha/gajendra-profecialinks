---
name: MarketShare Extensions Source Build
about: Create an issue with this template before starting a source build.
title: {MS-{:collection}-{:source}
labels: Source
assignees: ''

---

## Build Notes
- For each issue, make sure to create a new branch and work on that issue's build tasks while on that branch. 
 branch template: `{issue_title}`
 example git branch creation command: `git checkout -b MS-search-amazon_us`
- Commit code for tasks as they are completed(if code was needed) to that issue's branch. When starting or continuing work on different issue, make sure to `git checkout master` and create a new branch from master, or `git checkout {branch_name}` if a. branch was already created. 
- Work on 2 or more issues at once, but make sure to commit changes and `git checkout {branch_name}` your other issue's branch prior to starting the other issue's tasks. This will help avoid merge conflicts.
- Include issue hash `#` in every commit message. Reference the build task in the commit message.
commit message template: `{build_task}`
example commit message command:
`git commit -m '#58. Created extractor robot.'`
- If your circle ci build fails, we will not merge your PR- you will see this in the 'Review Required ' section of your PR.
- Make sure that your branch is up to date. That you have pulled and merged master. You will see this in the same section.
- Use const/let instead of var
- Make sure to capitalize the country codes
- Use url parameterValue in the createUrl file instead of creating your own implementation
- When making a PR, the PR should be named after your branch ( i.e. `{issue_title}`)


## Communication Notes
- Before sending the dev team a question, ask someone on your team whether they have dealt with the issue, and google the error
- If there’s still an issue, instead of DMing the dev team, put it on the Slack `#ascential-mse-dsd` channel or on stack overflow
- If adding a bug or asking for help on Slack, please add the steps needed to reproduce and a link to this issue and a reference to the code commit where you are seeing the problem. Also please make sure to push up your latest changes.

------

## Build Checklist
#### GitHub
- [ ] Ensure the CLI and repository are download correctly
- [ ] Assign yourself to this issue
- [ ] Add your team's label to this issue
- [ ] Confirm `Source` Label is added
- [ ] Link issue to the correct project
- [ ] Link issue to the correct milestone
- [ ] From Master, create a branch that references this issue.
`git checkout -b {issue_title}`

#### Building
- [ ] Promote Source to `Building` in Project Dash
- [ ] Add `Building` Label
- [ ] Create extractor robot
https://import-io.github.io/import-io-cli-public/#import-io-extractornew
- [ ] Add additional extractor logic as needed
- [ ] Edit extract.yaml to match expected output schema
[Data Dictionary/Schema](https://docs.google.com/spreadsheets/d/1mSz64xLBNeojENyaoPJNnYZenDxToZ45jKvqUZayHRc/edit#gid=0)
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step
- [ ] Remove `Building` Label

#### Testing
- [ ] Promote Source to `Testing` in Project Dash
- [ ] Add `Testing` Label
- [ ] Run extractor Locally
https://import-io.github.io/import-io-cli-public/#import-io-actionrunlocal
- [ ] Run extractor Remotely
https://import-io.github.io/import-io-cli-public/#import-io-actionrunremote
- [ ] Manual QA (run locally and remotely as needed to edit)
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step
- [ ] Remove `Testing` Label


#### Staging Deployment
- [ ] Promote Source to `Staging` in Project Dash
- [ ] Add `Staging` Label
- [ ] Deploy to `ms-staging` branch
https://import-io.github.io/import-io-cli-public/#import-io-extractordeploy
- [ ] Link `ms-staging` extractor GUID to MarketShare (POC) project > {collection}_raw_parquet > source in workbench
[**ascential/projects/marketshare_extensions/collections**](https://workbench.import.io/orgs/ascential/projects/marketshare_extensions/collections)
- [ ] Confirm source params are set up properly in workbench. Source `state` should be `staging`
- [ ] Scale/High Volume test
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step


#### Pull Request
- [ ] Promote Source to `Pull Request` in Project Dash
- [ ] Add `Pull Request` Label
- [ ] `npm run lint` or `npm run lint:fix` before creating pull request
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to linting
- [ ] Create pull request named after your branch ( i.e. `{issue_title}`)
- [ ] Ensure pull request is linked to this issue
- [ ] Ensure pull request passes build
- [ ] Add `Review Ready` Label to Pull request
- [ ] Confirm PR is approved/closed and changes were merged with master
- [ ] Remove `Staging` Label
- [ ] Remove `Pull Request` Label

------

#### Production
- [ ] Promote Source to `Production` in Project Dash
- [ ] Add `Production` Label
- [ ] Ensure extractor gets deployed to the `ms-production` branch in the daily production deployment
- [ ] Link production extractor GUID to production source in workbench
- [ ] Confirm source params are set up properly in workbench. Source `state` should be `production`
