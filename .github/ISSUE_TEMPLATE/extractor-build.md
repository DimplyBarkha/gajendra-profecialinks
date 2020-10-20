---
name: Check list for an extractor build
about: Create an issue with this template before starting a source build for a any feed type (search, core, media_tracker...)
title: "{feed_underscored_lowercase}-{retailer_name_camelcase}_{country_code_lowercase}, example: search-amazonPantry_us, core-mediaMarkt_de"
labels: Source
assignees: "@me"

---

## Pre-requisites
- Work on the corresponding retailer branch. If such branch does not exists then create it: `git checkout -b {retailer_name}` for the retailer syntax use only lower case and underscore instead of spaces.
- Only use one branch per retailer. Even if multiple feed type are on it.
- For development it is recommended to use VS code with the following optional extension: ESLint. Otherwise any IDE will work.
- Chrome must be installed
- The chrome extension [xpath helper](https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl) is a great help to identify xpaths

In here an issue corresponds to the development of a unique extractor: {feed_underscored}-{retailer_name}_{country code}

## Build Notes
- For each issue, make sure to use the retailer branch `{retailer_name}`
- Commit code for tasks as they are completed (if code was needed) to that issue's branch.
- It is mandatory that you include issue hash number `#{issue_number}` in every commit message
example commit message command:
`git commit -m '#58. Created extractor robot.'`
- If you work on 2 or more issues related to the same retailer, you do not need to change branch and can commit for both issues simultaneously.
example commit message command:
`git commit -m '#58#653 Changed goto code'`
- If you work on 2 or more issues that are from different retailers, you must change branch for each issue task with `git checkout {branch_name}` where `{branch_name}` is your other issue's branch. The change of branch must be done prior to starting the other issue's tasks
- If your circle ci build fails, we will not merge your PR- you will see this in the 'Review Required ' section of your PR.
- Make sure that your branch is up to date. That you have pulled and merged master. You will see this in the same section.
- Follow the linter and regulrlay run `npm run lint` to fix issues
- Make sure to capitalize the country codes
- When making a PR, the PR should be named after your branch ( i.e. `{issue_title}`)

## VERY IMPORTANT NOTES
- Try as much as possible to re-use code throughout the branch
- This means using a helper file which is re-used in multiple sources
- This means using the `extends` command in yaml file to re-use another file
- This means sharing the same transform.js wherever possible
- This means writing a single `goto.js` or `setZipcode.js` whenever such files are needed
- [Follow the best practises](https://docs.google.com/document/d/1rofgekA37Wmj-RZH7wkp6KGjZ09qslUCUjaCJ-OCncU/edit#)

## Communication Notes
- Before sending the dev team a question, ask someone on your team whether they have dealt with the issue, look if a similar issue has been answered in [SO](https://stackoverflow.com/c/import-io) and google the error
- Ask your questions on [Stack Overflow](https://stackoverflow.com/c/import-io) so everyone can benefit from the answer
- If there’s still an issue, prefer using slack to emails
- If adding a bug, posting a question on SO or asking for help on Slack, please add the steps needed to reproduce. This means a link to the workbench source, a command to run locally, the name of the branch with your latest changes pushed to.

------

## Build Checklist
#### Access with your import.io email
- [ ] Ensure you have access to import.io slack
- [ ] Ensure you have access to [Stack Overflow](https://stackoverflow.com/c/import-io)
- [ ] Ensure you have access to [Google classroom](https://classroom.google.com/c/MTY4NTIyNjQwOTMw/m/MTg5MjY2NjQ2MjI4/details)
- [ ] Ensure you have your import.io-GUID (different from workbench-GUID) example of a import.io-GUID : `214917d7-XXXX-XXXX-XXXX-a463bed96379` (Xs are added for privacy)
- [ ] Ensure you have your API key example of a an import.io API key : `XXXXXXXXXXce40a49217bfab0c601e565ea02fb27ae489b7617c4fca61d46fe211c247aac7ae04b194355673ae7f642bdd3dd94b056e036ed05367f4780626cc82bfa1f7ae307f946a45342XXXXXXXXX` (Xs are added for privacy)
- [ ] Ensure you have access to [workbench](https://workbench.import.io/orgs), you should be able to see at least one organization
- [ ] Ensure you have access to the import.io AWS S3 bucket


In case of any Access trouble please contact immediatly someone at import.io

#### Set-up
- [ ] Ensure the CLI and repository are download correctly
[Mac](https://workbench.import.io/download/cli/latest/mac), [Windows x64](https://workbench.import.io/download/cli/latest/windows/x64), [Windows x86](https://workbench.import.io/download/cli/latest/windows/x64), [Linux Debian amd64](https://workbench.import.io/download/cli/latest/deb/amd64), [Linux Debian armel](https://workbench.import.io/download/cli/latest/deb/armel)
- [ ] Run the config command of the cli:
`import-io config` with the API key that you have been provided
- [ ] Assign yourself to this issue 
- [ ] Add your team's label to this issue
- [ ] Link issue to the correct project, based on the feed type
- [ ] From Master, check-out the proper branch as described in the pre-requisites and the build notes above
- [ ] Change the file `config.yaml` located in `orgs>{org name}` and update the `legacyAccountId` to your import.io-GUID

#### Site scoping
- [ ] Verify if the data on the website is coming from an API network call
    - [ ] Mark this box if the data is only coming embedded in an HTML file and xpath/selectors need to be used to extract it
    - [ ] Mark this box if the data is coming from an ajax call or an api call
- [ ] Verify if the website can be accessed from anywhere or if geolocalized proxies are necessary (you can test it by using a vpn to the country where the website is based)
    - [ ] Mark this box if geoproxies are needed
    - [ ] Mark this box if geoproxies are not needed
- [ ] Verify if the website is detecting data center IPs and blocking them. Run a a remote command for that (this test can be done later during building)
    - [ ] Mark this box if remote runs get blocked
    - [ ] Mark this box if remote runs do not get blocked
- [ ] Verify if the website is requiring a custom preamble (check the classroom or contact SA for help)
    - [ ] Mark this box is requiring a custom preamble
    - [ ] Mark this box is not requiring a custom preamble
- [ ] Verify if the website has variants (if a product on a product page has multiple product variation, i.e. color, size, packaging...)
    - [ ] Mark this box if the website has variants, this means the variants flow must be used
    - [ ] Mark this box if the website doe not have variants
- [ ] Verify if a product page can be accessed directly from the retailer product code (RPC) or if a search needs to be done
    - [ ] Mark this box if the website requires a search before being able to access the product page when given RPC as input
    - [ ] Mark this box if the product page can directly be accessed when given RPC as input (through building the url or other means)
- [ ] Verify if the website can be navigated without providing a zipcode or selecting a location
    - [ ] Mark this box if the website requires to provide a zipcode or selecting a location
    - [ ] Mark this box if the website does not requires to provide a zipcode or selecting a location


#### Building
- [ ] Promote Source to `Building` in Project Dash
- [ ] Add `Building` Label
- [ ] Create extractor robot
`import-io extractor:new --org <workbench org slug> --parameters country=<2 letters country code> domain=<sub.domain.top> store=<retailerNameCamelCase> --robot <path/to/template>`
example:
`import-io extractor:new --org ascential --parameters country=NZ  domain=dyson.co.nz store=dyson zipcode='' --robot product/search`
- [ ] Add additional extractor logic as needed
- [ ] Edit extract.yaml to match expected output schema as [presented here](https://classroom.google.com/u/0/w/MTY4NTIyNjQwOTMw/tc/MTUwOTU1ODQ1MzQ3)
- [ ] Commit latest code changes to branch with a commit message that includes the issue# (`#{:number}`)
- [ ] Remove `Building` Label


#### Testing
- [ ] Promote Source to `Testing` in Project Dash
- [ ] Add `Testing` Label
- [ ] Create a limited set of 5 testing inputs
- [ ] Run extractor Locally for each of the 5 input values, output of therun is in `data.json`
`import-io action:run:local --parameters country=<2 letters country code> domain=<sub.domain.top> store=<retailerNameCamelCase> --action <path/to/template> --inputs <inputName>=<input value>`
Example:
`import-io action:run:local --parameters store=courir country=FR domain=courir.com --action product/details --inputs URL="https://www.courir.com/on/demandware.store/Sites-Courir-FR-Site/fr_FR/Product-Variation?pid=1453580&dwvar_1453580_size=29"`
- [ ] Run extractor Remotely, for each of the 5 input values, output of therun is in `data.json`
`import-io action:run:remote --parameters country=<2 letters country code> domain=<sub.domain.top> store=<retailerNameCamelCase> --action <path/to/template> --inputs <inputName>=<input value>`
Example:
`import-io action:run:remote --parameters store=courir country=FR domain=courir.com --action product/details --inputs URL="https://www.courir.com/on/demandware.store/Sites-Courir-FR-Site/fr_FR/Product-Variation?pid=1453580&dwvar_1453580_size=29"`
- [ ] Personal QA1: run locally and remotely as needed and edit until the data collected is satifactory.
- [ ] Commit latest code changes to branch with a commit message that includes the issue# (`#{:number}`)
- [ ] Remove `Testing` Label


#### Development
- [ ] Promote Source to `Internal Deployment` in Project Dash
- [ ] Add `Development` Label
- [ ] Use `npm run lint` or `npm run lint:fix` before creating pull request
- [ ] Create a pull request (PR) but not for `master` branch. Instead the base branch must be `internal`. Make sure that the automated merging check is green
- [ ] Add label to this PR `Ready for internal review`
- [ ] Add label to this issue `Ready for internal review`
- [ ] Deploy extractor, this will generate an extractor ID located in a file called `exractor.yaml` within the orgs folder
`import-io extractor:deploy -o <workbench org slug> -p product/<first letter of retailer>/<retailerName>/<country code>/<extractor type> -b <team name>`
example:
`import-io extractor:deploy -o ascential -p product/d/dyson/NL/details -b importio`
- [ ] Create a Workbench source in the appropriate project(s) and appropriate collection(s), contact SA if doubts
- [ ] Confirm source params are set up properly in workbench.
- [ ] In workbench, the source parameter called `state` be set to `development`
- [ ] Copy the extractor ID to the appropriate field in the newly created source(s)
- [ ] Copy the extractor ID tright here: `copy-paste-the-extractor-ID-here-instead-of-this-text`
- [ ] Create a `.csv` file with a sample set of inputs. The sample set must have between 50 and 100 inputs, or as many as available in the full input file (but never more than 100)
- [ ] Upload sample input file to the appropriate path in the import.io AWS S3 bucket
- [ ] Implement PR feedback
- [ ] Commit latest code changes to branch with a commit message that includes the issue# (`#{:number}`)
- [ ] Merge with `internal` branch, create a new branch from `internal`:
`git checkout internal`
`git checkout -b {retailer_name-internal}`
Or pull from ealready existing branch  `git checkout {retailer_name-internal}` and fetch latest commit to be up to date with `internal` branch.
This branch is now used to commit new changes. Similarly as before, always reference the issue number in the commit message.
- [ ] Remove label `Ready for internal review`
- [ ] Promote Source to `Internal testing` in Project Dash
- [ ] Personal QA2 : run the appropriate flow (ask SA in case of doubts) to test the source with the sample inputs and modify code if necessary
- [ ] When personal QA is satisfactory remove `Development` Label


#### Staging Deployment
- [ ] Promote Source to `Staging` in Project Dash
- [ ] Add `Staging` Label
- [ ] In workbench, change the source parameter called `state` from `development` to `staging`
- [ ] Check this to confirm that the source is now ready for manual QA
- [ ] In workbench, change the source parameter called `state` from `staging` to `scaleTest`
- [ ] System runs automated flow at scheduled time on the full input file, when this is done collect the resulting output `.csv` file
- [ ] In workbench, revert the source parameter called `state` from `scaleTest` back to `staging`
- [ ] Manual QA1 : Submit the scale test output csv for manual QA file according to SA instructions
- [ ] Add `Q1` Label
- [ ] Update sample input file to include the input rows tested by manual QA1
- [ ] Additional testing is done with a manual flow on the sample input file. Update extractor code to match expected accuracy level
- [ ] Commit latest code changes to the branch with a commit message that includes the issue# (`#{:number}`)
- [ ] (only necessary if QA1 did not match accuracy acceptance level) In workbench, change the source parameter called `state` from `staging` to `scaleTest`
- [ ] (only necessary if QA1 did not match accuracy acceptance level) System runs automated flow at scheduled time on the full input file, when this is done collect the resulting output `.csv` file
- [ ] (only necessary if QA1 did not match accuracy acceptance level) In workbench, revert the source parameter called `state` from `scaleTest` back to `staging`
- [ ] (only necessary if QA1 did not match accuracy acceptance level) Manual QA2 : Submit the scale test output csv for manual QA file according to SA instructions
- [ ] (only necessary if QA1 did not match accuracy acceptance level) Add `Q2` Label
- [ ] (only necessary if QA1 did not match accuracy acceptance level) Update sample input file to include the input rows tested by manual QA2
- [ ] (only necessary if QA1 did not match accuracy acceptance level) Additional testing is done with a manual flow on the sample input file. Update extractor code to match expected accuracy level
- [ ] (only necessary if QA1 did not match accuracy acceptance level) Commit latest code changes to the branch with a commit message that includes the issue# (`#{:number}`)
- [ ] Accuracy level on sample input file and on QA1 or QA2 is above acceptance threshold
- [ ] Remove `Staging` Label


#### Pre-Live
- [ ] Promote Source to `Pre-Live` in Project Dash
- [ ] Add `Pre-Live` Label
- [ ] In workbench, change the source parameter called `state` from `staging` to `preLive`
- [ ] Use `npm run lint` or `npm run lint:fix` before creating pull request
- [ ] Create a pull request (PR) for `master` branch. Make sure that the automated merging check is green
- [ ] Add label `Final Review Requested`
- [ ] Add label `Final Review Requested` to the pull request
- [ ] Check that the feed is properly imported in the UAT tool
- [ ] If required, Score card is built and approved
- [ ] Implement PR feedback and possible required code updates to satisfy the UAT QA and the score card
- [ ] Commit latest code changes to the branch with a commit message that includes the issue# (`#{:number}`)
- [ ] PR approved and merged
- [ ] Remove label `Final Review Requested`
- [ ] Remove `Pre-Live` Label

------

#### Production
- [ ] Promote Source to `Production` in Project Dash
- [ ] In workbench, change the source parameter called `state` from `preLive` to `productionReady`
- [ ] Add `Production` Label
