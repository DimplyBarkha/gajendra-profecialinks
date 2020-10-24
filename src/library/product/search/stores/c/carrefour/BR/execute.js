async function implementation(
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
  //written code for custom pagination to solve the product repeatation issue
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          })
        }
        try {
          await context.waitForSelector('div[class*="imageContainer"] > img', { timeout: 50000 });
          console.log('Image loaded successfully');
        } catch (e) {
          console.log('can not load the image');
        }
        let totalProductOnPage = document.querySelectorAll('div[class*="galleryItem"]');
        console.log('total product on the page is this number ->', totalProductOnPage.length)
        if (scrollTop === 20000 || totalProductOnPage.length >= 125) {
          console.log('here the loop is going to break')
          await stall(1500);
          break;
        }
        const clickButton = document.querySelector('a[rel="next"]');
        if (clickButton) {
          clickButton.click();
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const searchUrl = window.location.href;
      const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          if (element.getAttribute('searchurl') == null) {
            element.setAttribute('searchurl', searchUrl);
          }
        })
      }
    });
  };
  await applyScroll(context);
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
    country: 'BR',
    store: 'carrefour',
    domain: 'carrefour.com.br',
    url: 'https://www.carrefour.com.br/busca/{searchTerms}',
    loadedSelector: 'div[class*="imageContainer"]>img',
    noResultsXPath: '//div[contains(@class,"layout")]/div[contains(@class,"searchNotFound")]',
    zipcode: '',
  },
  implementation,
};
