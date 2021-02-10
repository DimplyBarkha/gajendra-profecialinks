/* eslint-disable space-before-function-paren */

/**
 *
 * @param { { URL: string, id: any, RPC: string, SKU: string, date: any, days: number, results} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any, mergeType: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action, paginate: ImportIO.Action } } dependencies
 */
async function implementation(
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
      reviewDate = document.querySelector('div.review-context time').getAttribute('title');
      console.log('reviewElement' + reviewDate);
      const text = reviewDate;
      var d = new Date(text);
      var resultss = d.toLocaleDateString();
      if (resultss) {
        if (resultss && resultss.length > 0) {
          reviewDate = resultss[1];
        }
      }
      return reviewDate;
    });
  };

  const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    return (new Date(reviewDate).getTime() > timestamp);
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
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    zipcode: '',
    mergeType: null,
  },
  implementation,
};
