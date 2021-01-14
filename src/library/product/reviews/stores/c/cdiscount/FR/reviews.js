
/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, date: any, days: number, results} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  { mergeType, zipcode },
  context,
  { execute, extract, paginate },
) {
  const { URL: url, RPC, SKU, date: dateOrigin = null, days = 30, results = 10000 } = inputs;
  const id = RPC || SKU || inputs.id;
  const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

  const date = new Date(days ? new Date().setDate(new Date().getDate() - days) : dateOrigin);
  console.log(`Date Limit: "${date}"`);

  const resultsReturned = await execute({ url, id, zipcode, date, days });

  const getReviewDate = async () => {
    return context.evaluate(async () => {
      let reviewDate = '';
      const reviewSelector = '//*[@id="fpRating"]//div[contains(@class,"jsDetRating")][last()]//span[contains(@class,"ratingPublishDetails")]';
      const reviewElement = document.evaluate(reviewSelector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (reviewElement) {
        const pattern = /(\d{1,2}\/\d{1,2}\/\d{4})/i;
        const results = reviewElement.innerText.match(pattern);
        if (results && results.length > 0) {
          reviewDate = results[1];
        }
      }
      return reviewDate;
    });
  };

  const checkIfReviewIsFromLast30Days = async (lastDate, reviewDate) => {
    const timestamp = new Date(lastDate).getTime();
    return (new Date(reviewDate).getTime() < timestamp);
  };

  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  const pageOne = await extract({});
  let collected = length(pageOne);

  console.log(`Got initial number of results: ${collected}`);

  // check we have some data
  if (collected === 0) return;

  let page = 2;
  while (results > collected && await paginate({ id, page, offset: collected, date })) {
    const data = await extract({});
    const count = length(data);
    const reviewDate = await getReviewDate();
    const nlBEFormatter = new Intl.DateTimeFormat('nl-BE');
    const lastDate = nlBEFormatter.format(new Date(new Date().setDate(new Date().getDate() - days)));
    if (await checkIfReviewIsFromLast30Days(lastDate, reviewDate)) {
      break;
    }
    if (count === 0) break; // no results
    collected = (mergeType && (mergeType === 'MERGE_ROWS') && count) || (collected + count);
    console.log('Got more results', collected);
    page++;
  }
}

module.exports = {
  implements: 'product/reviews',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    domain: 'cdiscount.fr',
    zipcode: '',
    mergeType: null,
  },
  implementation,
};
