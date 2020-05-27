
This works:
import-io action:run:local --parameters country=GB domain=asda.com store=asda --action product/search --inputs keywords=lamb

import-io action:run:local --parameters country=US domain=amazon.com store=amazon --action product/search --inputs keywords=tennis

??
import-io action:run:local --parameters country=US domain=safeway.com store=safeway --action product/search --inputs keywords=milk



legacyAccountId: 9b59961b-b5ee-4cd8-8bf9-19fc6f1abbd9

Create my own for asada
import-io extractor:new --org tf_docs_org --parameters country=GB domain=asda.com store=asda --robot product/search


Create my own for asada
import-io extractor:new --org tf_docs_org --parameters country=GB domain=asda.com store=asda --robot product/search


Deploy my version
import-io extractor:deploy -o tf_docs_org  -p product/search -b dev



