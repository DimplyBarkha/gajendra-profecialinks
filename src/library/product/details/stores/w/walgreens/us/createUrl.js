
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walgreens.com',
    store: 'walgreens',
    country: 'us',
  },
  implementation: async ({ id }, parameters, context, dependencies) => {
    const { timeout = 25000, waitUntil = 'load', checkBlocked = true } = {};
    const domain = 'walgreens.com';
    const searchUrl = `https://${domain}/search/results.jsp?Ntt=${id}`;
    // await gotoUrl({ url: searchUrl }, { domain }, context);
    await context.goto(searchUrl, { timeout, waitUntil, checkBlocked });
    const path = await context.evaluate(() => {
      const xpathFirstResult = '//div[@id="product-row-0"]//a[@name="product-title"]/@href';
      const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (node && node.singleNodeValue) {
        return node.singleNodeValue.nodeValue;
      } else {
        return false;
      }
    });
    if (!path) {
      context.extract('product/details/stores/w/walgreens/us/extract')
        .then(() => {
          throw new Error('404: Item not found');
        });
    } else {
      console.log(`https://${domain}${path}`);
      return `https://${domain}${path}`;
    }
  },
};
