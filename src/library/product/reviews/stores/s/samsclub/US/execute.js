
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    loadedSelector: null,
    noResultsXPath: null,
    reviewUrl: 'https://www.samsclub.com/p/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation: async function({ url, id, zipcode, date, days }, { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
) {
  
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      const applyScroll = async function (context) {
        await context.evaluate(async function () {
          let scrollTop = 0;
          while (scrollTop !== 20000) {
            scrollTop += 100;
            window.scroll(0, scrollTop);
            await stall(1000);
          }
          function stall(ms) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, ms);
            });
          }
          
        });
        console.log("scroll");
      };
      await context.evaluate(async () => {
        const closePopupButton1 = document.querySelector('.sc-modal-content > div button');
        if (closePopupButton1 !== null) {
          // @ts-ignore
          closePopupButton1.click();
        }
      })
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      await delay(10000);
      await applyScroll(context);
      await context.waitForSelector('.bv-header .bv-action-bar')
      context.waitForFunction((sel, xp) => {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, {"timeout":100000}, ".reviews-questions", "//div[@class=\"main-wrapper\"]//div[@role=\"region\"]")
    console.log('Checking no results', noResultsXPath);
    await applyScroll(context);
    // return await context.evaluate((xp) => {
//         const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
//         console.log(xp, r);
//         const e = r.iterateNext();
//         console.log(e);
//         return !e;
//     }, noResultsXPath);
}
};
