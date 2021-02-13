/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  try {
    await context.waitForSelector("div[class='region-selector'] ul[class='region-selector__regions-list'] li:nth-of-type(1) button");
    await context.click("div[class='region-selector'] ul[class='region-selector__regions-list'] li:nth-of-type(1) button");
  }catch (e) {
    console.log(e);
  }  
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  const applyScroll = async function (context) {
    console.log('calling applyScroll-----------');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        console.log('calling applyScroll evaluate-----------', window);
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  let loadMoreComplete=false;
  try{
    await context.waitForSelector("div[class='product-grid__results__footer'] div[class='load-more-button'] button",{timeout:1000});
    await context.click("div[class='product-grid__results__footer'] div[class='load-more-button'] button");
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  }catch(e){
    loadMoreComplete=true;
    await applyScroll(context);
  }

  if(loadMoreComplete==false){
    try{
      await context.waitForSelector("div[class='product-grid__results__footer'] div[class='load-more-button'] button",{timeout:1000});
      await context.click("div[class='product-grid__results__footer'] div[class='load-more-button'] button");
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    }catch(e){
      loadMoreComplete=true;
      await applyScroll(context);
    }
  }
  

  if(loadMoreComplete==false){
    try{
      await context.waitForSelector("div[class='product-grid__results__footer'] div[class='load-more-button'] button",{timeout:1000});
      await context.click("div[class='product-grid__results__footer'] div[class='load-more-button'] button");
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    }catch(e){
      loadMoreComplete=true;
      await applyScroll(context);
    }
  }

  console.log('Checking no results', parameters.noResultsXPath);
  

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'nofrills',
    domain: 'nofrills.ca',
    url: "https://www.nofrills.ca/search?search-bar={searchTerms}",
    loadedSelector: "div[class='product-grid__results__products'] ul[data-cruller='product-tile-group'] li[class='product-tile-group__list__item'] div[class='product-tile__thumbnail'] img",
    noResultsXPath: "//div[@class='search-no-results']//h2",
    zipcode: '',
  },
  implementation,
};
