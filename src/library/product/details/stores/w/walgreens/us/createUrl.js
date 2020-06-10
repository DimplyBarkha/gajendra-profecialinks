
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walgreens.com',
    prefix: null,
    url: null,
    store: 'walgreens',
    country: 'us',
  },
  implementation: async ({ id }, parameters, context, dependencies) => {
    const { timeout = 10000, waitUntil = 'load', checkBlocked = true } = {};
    const domain = 'walgreens.com';
    const searchUrl = `https://${domain}/search/results.jsp?Ntt=${id}`;
    // await gotoUrl({ url: searchUrl }, { domain }, context);
    await context.goto(searchUrl, { timeout, waitUntil, checkBlocked });
    const path = await context.evaluate(() => {
      const xpathFirstResult = '//div[@id="product-row-0"]/div/div[@id][1]//div/div/div[@name]/a[@title][@name]/@href';
      const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (node && node.singleNodeValue) return node.singleNodeValue.nodeValue;
      throw new Error('404: Item not found');
    });
    return `https://${domain}${path}`;
  },
};
