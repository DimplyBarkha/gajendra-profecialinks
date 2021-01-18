
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    // loadedSelector: ['div.css-1dbjc4n.r-18u37iz.r-1oy2gb8 > div.css-901oao.r-vw2c0b', 'div.css-1dbjc4n.r-18u37iz.r-tzz3ar a', 'div.css-1dbjc4n.r-6koalj.r-156q2ks.r-y46g1k'],
    noResultsXPath: ['//div[@class="css-1dbjc4n r-13awgt0"]//div[contains(.,"Check your spelling")]', './/*[contains(.,"Sorry, we")]', '//div[contains(@class,"css-1dbjc4n r-ymttw5")]/h4[contains(.,"Sorry")]'],
  },
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'domain',
      description: 'top private domain (e.g. amazon.com)',
    },
    {
      name: 'loadedSelector',
      description: 'XPath to tell us the page has loaded',
      optional: true,
    },
    {
      name: 'noResultsXPath',
      description: 'XPath to tell us the page has loaded',
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of product',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation: async (inputs, parameters, context, dependencies) => {
    let { url, id } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      url = await dependencies.createUrl({ id });
    }

    // TODO: Check for not found?
    await dependencies.goto({ url, timeout: 50000 });

    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel[0]) || document.querySelector(sel[1]) || document.querySelector(sel[2]) || document.evaluate(xp[0], document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp[1], document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp[2], document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 40000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  },

};
