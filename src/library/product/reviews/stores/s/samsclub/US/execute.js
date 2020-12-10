
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    loadedSelector: '.reviews-questions',
    noResultsXPath: '//div[@class="main-wrapper"]//div[@role="region"]',
    reviewUrl: 'https://www.samsclub.com/p/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation: async function({ url, id, zipcode, date, days }, { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
    context,
    dependencies,
) {
    // const patternReplace = () => {
    //     if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    //     let tempUrl = reviewUrl;
    //     if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    //     if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    //     if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    //     return tempUrl;
    // };
    // const destinationUrl = url || patternReplace();

    // await dependencies.goto({ url: destinationUrl, zipcode });

    // if (loadedSelector) {
    //     await context.waitForFunction((sel, xp) => {
    //         return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    //     }, { timeout: 100000 }, loadedSelector, noResultsXPath);
    // }

    // if (sortButtonSelectors) {
    //     const selectors = sortButtonSelectors.split('|');
    //     for (const selector of selectors) {
    //         await context.click(selector);
    //     }
    //     await context.evaluate(async() => {
    //         document.body.setAttribute('url', window.location.href);

    //         function stall(ms) {
    //             return new Promise((resolve, reject) => {
    //                 setTimeout(()  =>  {
    //                     resolve();
    //                 }, ms);
    //             });
    //         }
    //         await stall(5000);

    //     });
    // }
    // await context.evaluate(async () => {
    //   const closePopupButton = document.querySelector('.sc-modal-content > div button ');
    //   if (closePopupButton !== null) {
    //     closePopupButton.click();
    //     console.log("button clicked");
        
    //   }
    // });
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
          await stall(5000)
        });
        console.log("scroll");
      };
      await context.evaluate(async (context) => {
        const closePopupButton1 = document.querySelector('.sc-modal-content > div button');
        if (closePopupButton1 !== null) {
          closePopupButton1.click();
        }
      })
      await context.waitForSelector('.reviews-questions', { timeout: 30000 });
      await applyScroll(context);
    console.log('Checking no results', noResultsXPath);
    return await context.evaluate((xp) => {
        const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        console.log(xp, r);
        const e = r.iterateNext();
        console.log(e);
        return !e;
    }, noResultsXPath);
}

};
 