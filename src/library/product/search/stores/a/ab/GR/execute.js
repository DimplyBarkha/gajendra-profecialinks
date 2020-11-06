async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // written code for custom pagination to solve the product repeatation issue
  // await context.evaluate(async () => {
  //   const clickButton = document.querySelector('button[class*="accept-all"]');
  //   if (clickButton) {
  //     clickButton.click();
  //     await new Promise((res) => setTimeout(res, 5000));
  //   }
  // })
  try {
    await context.waitForSelector('button[class*="accept-all"]', { timeout: 30000 });
    console.log('selector loaded successfully');
    await context.click('button[class*="accept-all"]');
  } catch (e) {
    console.log('Button is not clicked');
  }
  const applyScroll = async function () {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('li[class*="data-item"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        const totalProductOnPage = document.querySelectorAll('li[class*="data-item"]');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop === 20000 || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(1500);
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
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll('li[class*="data-item"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          if (element.getAttribute('searchurl') == null) {
            element.setAttribute('searchurl', searchUrl);
          }
        });
      }
    });
  };
  await applyScroll();
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
    country: 'GR',
    store: 'ab',
    domain: 'ab.gr',
    url: 'https://www.ab.gr/click2shop/search?text={searchTerms}',
    loadedSelector: 'a[class*="Product"]>img',
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    zipcode: '',
  },
  implementation,
};
