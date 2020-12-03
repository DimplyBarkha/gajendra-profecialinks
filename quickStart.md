

Create a product details extractor that take a URL as input and extract data.

Example site:
https://bonescoffee.com/products/costa-rica-single-origin-coffee-by-bones-coffee-company-12oz


1. Create a new extractor with "extractor:new"

Run the following command to scaffold the files:

```import-io extractor:new --org=tf_docs_org --parameters country=US  domain=bonescoffee.com store=bonescoffee  --robot product/details```

2. Verify the scaffolded files are created and make site specific updates

 ```src/library/product/details/stores/b/bonescoffee/US```

    createUrl.js
    details.js
    execute.js
    extract.js
    extract.yaml

`extract.yaml`  Contains a default schema columns with selectors. 
Add the selector for `name` as follows:
  - name: name
    singleValue: true
    manualSelector: .product-single__title
    description: The product name
    
```src/orgs/tf_docs_org/product/b/bonescoffee/US/details```

    extractor.yaml
    inputs.yaml

Edit ```inputs.yaml``` and add your target url(s).

3. Run the new extractor

```bash
import-io action:run:local --parameters  country=US  domain=bonescoffee.com store=bonescoffee  --action product/details --inputs URL=https://bonescoffee.com/products/costa-rica-single-origin-coffee-by-bones-coffee-company-12oz
```

A successful run should:

    a. Open a browser on your desktop
    b. Go to the URL passed in the command
    c. Write data with the extracted data in the root director of your robot to data.json  =>  Written 1 rows to data.json

    Example data.json:
```json
    [
  {
    "mergeOptions": {},
    "extractionConfig": "product/details/stores/b/bonescoffee/US/extract",
    "data": [
      {
        "group": [
          {
            "name": [
              {
                "text": "Costa Rica Single-Origin | 12oz",
                "xpath": "/html/body/div[4]/main[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/h1[1]"
              }
            ]
          }
        ],
        "xpath": "/html/body/div[4]/main[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]"
      }
    ],
    "url": "https://bonescoffee.com/products/costa-rica-single-origin-coffee-by-bones-coffee-company-12oz",
    "timestamp": "2020-12-03T00:43:10.614Z"
  }
]
```

4. Run remote with ```action:run:remote```

Running remote means the extractor code is executed in import.io "chromium" servers. This is needed for some commands to work, for example captcha solving.

```bash
import-io action:run:remote --parameters  country=US  domain=bonescoffee.com store=bonescoffee  --action product/details --inputs URL=https://bonescoffee.com/products/costa-rica-single-origin-coffee-by-bones-coffee-company-12oz
```


5. Deploy the extractor

Run the following command with the user guid from the SAAS account you want to deply to.

```bash
import-io extractor:deploy --org=tf_docs_org --prefix=product/b/bonescoffee/US/details --account={SAAS GUIG} -b dev
```
Successful output will end with a message like:

```bash
Deploying.....
=============================

👷‍ Deploying product/b/bonescoffee/US/details
Requiring module extractor:product/b/bonescoffee/US/details
Resolved module location: src/orgs/tf_docs_org/product/b/bonescoffee/US/details/extractor.yaml
Requiring module robot:product/details
Resolved module location: src/library/product/details/robot.yaml
Init extractor
Updating with extrator id for branch src/orgs/tf_docs_org/product/b/bonescoffee/US/details/extractor.yaml
Init policy
Linking policy
Updating with extrator id for branch src/orgs/tf_docs_org/product/b/bonescoffee/US/details/extractor.yaml
Runtime configuration has changed
Created new RTC: 20d232cc-51ed-4804-a7b8-02a03461ab7d
Updating extractor
Updating sample inputs
✅ Deployed
```
