module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol-im',
    domain: 'bol.com',
    url: 'https://www.bol.com/nl/s/?searchtext={searchTerms}&view=list',
    loadedSelector: '.loader-control__content',
    noResultsXPath: '//div[@data-test="no-result-content"]',
    zipcode: '',
  },
  implementation: async (inputs, { url, loadedSelector, noResultsXPath }, context, dependencies) => {
    const { searchURL, keywords, query } = inputs;

    console.log(`searchURL: ${searchURL}`);
    url = searchURL || url;
    console.log(url);

    if (url.includes('{searchTerms}') && !keywords) throw new Error('No keywords provided');
    if (url.includes('{queryParams}') && !query) throw new Error('No query provided');

    const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords)).replace('{queryParams}', query);
    await dependencies.goto({ ...inputs, url: destinationUrl });

    if (loadedSelector) {
      await context.waitForFunction(
        function (sel, xp) {
          return Boolean(
            document.querySelector(sel) ||
              document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
          );
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }

    // the popup is visible after a moment -> delaying the removal
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isPopupPresent = await context.evaluate(async () => !!document.querySelector('div.modal__overlay'));
    // when the popup is present it returns undefined, when not - null
    if (isPopupPresent) {
      await context.evaluate(() => {
        // @ts-ignore
        document.querySelector('button.js-confirm-button').click();
      });
    }

    console.log(`noResultsXPath: ${noResultsXPath}`);
    return await context.evaluate(
      (xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
      noResultsXPath,
    );
  },
};
