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

  if (!resultsReturned) {
    console.log('No results were returned');
    return;
  }

  async function customizedPagination(nextLinkSelector, loadedSelector){
    if (nextLinkSelector) {
      console.log('Clicking', nextLinkSelector);
      await context.evaluate(async function(nextLinkSelector){
        document.querySelector(nextLinkSelector)&&document.querySelector(nextLinkSelector).click(); 
      }, nextLinkSelector); 
      //await context.clickAndWaitForNavigation(nextLinkSelector, {}, { timeout: 20000 });
      await context.waitForNavigation({ timeout: 20000 });
      if (loadedSelector) {
        await context.waitForSelector(loadedSelector, { timeout: 20000 });
      }
      // if (loadedXpath) {
      //   await context.waitForXPath(loadedXpath, { timeout: 20000 });
      // }
      return true;
    }
  }

  async function checkStopCondition(stopConditionSelectorOrXpath) {
    return await context.evaluate(async function (stopConditionSelectorOrXpath) {
      const isThere = document.querySelector(stopConditionSelectorOrXpath);
      let pageNumber = 0;
      if(isThere) {
        pageNumber = isThere.href.replace(/(.+)pg:(\d+)(.+)/gm,'$2');
      }
      else{ pageNumber = 10000; }
      // console.log('check paginate', !!isThere);
       console.log('pageNumber', pageNumber);
      return Number(pageNumber)>25?false:true;
    }, stopConditionSelectorOrXpath)
  }
  let IS_PAGINATION = await checkStopCondition('li.bv-content-pagination-buttons-item-next a');
  console.log('is pagination', IS_PAGINATION);

  const pageOne = await extract({});
  let collected = length(pageOne);

  console.log(`Got initial number of results: ${collected}`);

  // check we have some data
  if (collected === 0) return;

  let page = 2;
  // while (results > collected  && await paginate({ id, page, offset: collected, date })) {
    const nextLinkSelector = 'span[class="bv-content-btn-pages-next"]';
    const loadedSelector = 'div[data-dmid="detail-image-slider-container"]';
    const nextLinkXpath = '//li[contains(@class,"bv-content-pagination-buttons-item-next")]//a//span[@class="bv-content-btn-pages-next"]';
    
    while (results > collected  && IS_PAGINATION && await customizedPagination(nextLinkSelector, loadedSelector)) {
    const data = await extract({});
    const count = length(data);
    if (count === 0) break; // no results
    collected = (mergeType && (mergeType === 'MERGE_ROWS') && count) || (collected + count);
    console.log('Got more results', collected);
    IS_PAGINATION = await checkStopCondition('li.bv-content-pagination-buttons-item-next a');
    //console.log('inside while ');
    page++;
  }
}
module.exports = {
  implements: 'product/reviews',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    zipcode: '',
    mergeType: null,
  },
  implementation
};
