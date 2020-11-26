
// module.exports = {
//   implements: 'product/reviews/execute',
//   parameterValues: {
//     country: 'US',
//     store: 'walmart',
//     domain: 'walmart.com',
//     // loadedSelector: 'div.QAItem-wrapper',
//     // //div[contains(@class,"QAItem-wrapper")]
//     loadedSelector: 'div#questions-answers',
//     noResultsXPath: null,
//     reviewUrl: null,
//     sortButtonSelector: null,
//     zipcode: '',
//   },
// };
async function implementation(
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const patternReplace = () => {
    if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = reviewUrl;
    if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    return tempUrl;
  };
  const destinationUrl = url || patternReplace();

  await dependencies.goto({ url: destinationUrl, zipcode });

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  
  await new Promise((resolve) => setTimeout(resolve, 3500));
  await context.evaluate(async function () {
    const element = document.querySelector('div#questions-answers');
    console.log('element15');
    if (element) {
      console.log('element12');
      console.log(element);
      element.scrollIntoView({ behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  });


  const scrollToContent = async (selector) => {
    await context.evaluate(async (selectorToScrollTo) => {
      function scrollToSmoothly (pos, time) {
        return new Promise((resolve, reject) => {
          if (isNaN(pos)) {
            return reject(new Error('Position must be a number'));
          }
          if (pos < 0) {
            return reject(new Error('Position can not be negative'));
          }
          var currentPos = window.scrollY || window.screenTop;
          if (currentPos < pos) {
            var t = 10;
            for (let i = currentPos; i <= pos; i += 10) {
              console.log('Scrolling');
              t += 10;
              setTimeout(function () {
                window.scrollTo(0, i);
              }, t / 2);
            }
            return resolve();
          } else {
            time = time || 100;
            var i = currentPos;
            var x;
            x = setInterval(function () {
              window.scrollTo(0, i);
              i -= 10;
              if (i <= pos) {
                clearInterval(x);
              }
            }, time);

            return resolve();
          }
        });
      }
      const elem = document.querySelector(selectorToScrollTo);
      if (!elem) {
        return;
      }
      await scrollToSmoothly(elem.offsetTop);
    }, selector);
  };
  // await scrollToContent('div#questions-answers');
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 45000 }, loadedSelector, noResultsXPath);
  }

  await context.waitForXPath('//div[contains(@class,"QAItem-wrapper")]', { timeout: 35000 })
    .catch( ()=> console.log('waited for reviews to load, none found '));

  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    domain: 'walmart.com',
    // loadedSelector: 'div.QAItem-wrapper',
    // //div[contains(@class,"QAItem-wrapper")]
    loadedSelector: 'div#questions-answers',
    // noResultsXPath: 'boolean(count(//div[contains(@class, "QAHeader-sort")]))',
    noResultsXPath: '//div[contains(@class, "error-page-content")]',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
  implementation,
};
