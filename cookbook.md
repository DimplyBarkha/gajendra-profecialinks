Goal: Create a search extractor for safeway.com

Search url example (Searching for soap)
https://www.safeway.com/shop/search-results.html?q=soap&zipcode=94611

# Create extractor scaffolding
import-io extractor:new --org tf_docs_org --parameters country=US domain=safeway.com store=safeway --robot product/search

import-io extractor:new --org mjgp2 --parameters country=US domain=safeway.com store=safeway --robot product/search

this creates src/library/product/search/stores/s/safeway/US/extract.yaml



Add files in  dir src/library/product/search/stores/s/safeway/US/
add file execute.js
This file contains the search url pattern and results selector

add file extract.js

add file paginate.js

add the file search.js


