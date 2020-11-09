const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    transform: cleanUp,
    domain: 'apotekhjartat.se',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
      const a = document.evaluate('//ul[@class="slides"]/li[not(contains(@class,"clone")) and (position()>2)]/img', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      let b = a.iterateNext();
      const c = [];
      while (b !== null) {
        c.push(b.getAttribute('src').split('?')[0]);
        b = a.iterateNext();
      }
      const div = document.createElement('div');
      div.setAttribute('id', 'alt-img');
      div.innerText = c.join(' | ');
      document.body.append(div);
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
