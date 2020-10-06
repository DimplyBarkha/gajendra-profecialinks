
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
  console.log('params', parameters, inputs);

  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  await context.waitForSelector('input[name=buscador]');
    await context.setInputValue('input[name=buscador]',inputs.keywords);
    await context.click('input[name=buscador]');
  context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  try {
    await context.click('div#df-results__content__dfclassic');
  }catch (e) {
    console.log(e);
  }
  new Promise((resolve, reject) => setTimeout(resolve, 1000));
  //scroll function
  const applyScroll = async function (context) {
    context.click('div#df-results__content__dfclassic');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
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
  await applyScroll(context);

  //end here
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
    country: 'ES',
    store: 'milar',
    domain: 'milar.es',
    url: 'https://www.milar.es',
    loadedSelector: 'div#df-results__content__dfclassic',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
