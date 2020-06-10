---
name: Digital Shelf Source Build
about: Create an issue with this template before starting a source build.
title: DS:{:collection}:{:source}
labels: Source
assignees: ''

---

## Build Notes
- For each issue, make sure to create a new branch and work on that issue's build tasks while on that branch. 
 branch template: `{issue_title}`
 example git branch creation command: `git checkout -b DS:details:amazon_us`
- Commit code for tasks as they are completed(if code was needed) to that issue's branch. When starting or continuing work on different issue, make sure to `git checkout master` and create a new branch from master, or `git checkout {branch_name}` if a. branch was already created. 
- Work on 2 or more issues at once, but make sure to commit changes and `git checkout {branch_name}` your other issue's branch prior to starting the other issue's tasks. This will help avoid merge conflicts.
- Include issue hash `#` in every commit message. Reference the build task in the commit message.
commit message template: `{build_task}`
example commit message command:
`git commit -m '#58. Created extractor robot.'`


## Build Checklist
#### GitHub
- [ ] Ensure the CLI and repository are download correctly
- [ ] Assign yourself to this issue
- [ ] Confirm `Source` Label is added
- [ ] Link issue to the correct project
- [ ] Link issue to the correct milestone
- [ ] From Master, create a branch that references this issue.
`git checkout -b {issue_title}`

#### Building
- [ ] Promote Source to `Building` in Project Dash
- [ ] Please add `Building` Label
- [ ] Create extractor robot
https://import-io.github.io/import-io-cli-public/#import-io-extractornew
- [ ] Add additional extractor logic as needed
- [ ] Edit extract.yaml to match expected output schema
[Data Dictionary/Schema](https://docs.google.com/spreadsheets/d/1mSz64xLBNeojENyaoPJNnYZenDxToZ45jKvqUZayHRc/edit#gid=0)
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step
- [ ] Please remove `Building` Label

#### Testing
- [ ] Promote Source to `Testing` in Project Dash
- [ ] Please add `Testing` Label
- [ ] Run extractor Locally
https://import-io.github.io/import-io-cli-public/#import-io-actionrunlocal
- [ ] Run extractor Remotely
https://import-io.github.io/import-io-cli-public/#import-io-actionrunremote
- [ ] Manual QA (run locally and remotely as needed to edit)
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step
- [ ] Please remove `Testing` Label


#### Internal Deployment
- [ ] Promote Source to `Internal Deployment` in Project Dash
- [ ] Add `Development` Label
- [ ] Create a Workbench source in the Development(internal) collection
- [ ] Deploy to `development` branch
https://import-io.github.io/import-io-cli-public/#import-io-extractordeploy
- [ ] Link `development` extractor GUID to Development(internal) collection > source in workbench
- [ ] Confirm source params are set up properly in workbench. Source `state` should be `development`
- [ ] Scale/High Volume run
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step

#### Peer Review
- [ ] Promote Source to `Peer Review` in Project Dash
- [ ] Please add `Peer Review Requested` Label
- [ ] Confirm that a reviewer has been assigned to this issue
- [ ] Peer Review QA Complete (must be checked by reviewer)
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step
- [ ] Please remove `Peer Review Requested` Label

#### Staging Deployment
- [ ] Promote Source to `Staging Deployment` in Project Dash
- [ ] Remove `Development` Label
- [ ] Add `Staging` Label
- [ ] Create a Workbench source in the Production(external) collection
- [ ] Deploy to `staging` branch
https://import-io.github.io/import-io-cli-public/#import-io-extractordeploy
- [ ] Link `staging` extractor GUID to Production(external) collection > source in workbench
- [ ] Confirm source params are set up properly in workbench. Source `state` should be `staging`
- [ ] Scale/High Volume test
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to this build step

#### Final Review
- [ ] Promote Source to `Final Review` in Project Dash
- [ ] Add `Final Review Requested` Label
- [ ] SA QA approval Complete
- [ ] Remove `Final Review Requested` Label

#### Pull Request
- [ ] Promote Source to `Pull Request` in Project Dash
- [ ] Add `Pull Request` Label
- [ ] `npm run lint` or `npm run lint:fix` before creating pull request
- [ ] Commit latest code changes to local branch with a commit message that includes the issue# (`#{:number}`) and a reference to linting
- [ ] Create pull request
- [ ] Ensure pull request passes build
- [ ] Add `Review Needed` Label to Pull request
- [ ] Ensure pull request is linked to this issue

------

#### Production
- [ ] Confirm PR is approved/closed and changes were merged with master
- [ ] Confirm Source was promoted to `Production` in Project Dash
- [ ] Remove `Staging` Label
- [ ] Remove `Pull Request` Label
- [ ] Add `Production` Label
- [ ] Ensure extractor gets deployed to the `production` branch in the daily production deployment
- [ ] Link production extractor GUID to production source in workbench
- [ ] Confirm source params are set up properly in workbench. Source `state` should be `production`
