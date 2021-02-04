
module.exports = {
  implements: 'product/details/createUrl',
  dependencies: {
    goto: 'action:navigation/goto',
  },
  parameterValues: {
    domain: 'www.walgreens.com',
    store: 'walgreens',
    country: 'us',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { id, url } = inputs;
    const { domain } = parameters;

    if (url) return url;

    await dependencies.goto({ url: `https://${domain}` });

    const response = await context.evaluate(async (id) => {
      const postAPIEndPoint = 'https://www.walgreens.com/productsearch/v3/products/search';
      const response = await fetch(postAPIEndPoint, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ q: `"${id}"`, requestType: 'search', includeDrug: true, sort: 'relevance' }),
        method: 'POST',
      }).then(r => r.text());
      return response;
    }, id);

    let jsonObj;
    try {
      jsonObj = JSON.parse(response);
    } catch (error) {
      throw new Error('Access got denied');
    }

    if (jsonObj.products) {
      const path = jsonObj.products[0].productInfo.productURL;

      console.log(`!!!!path : ${path}`);

      return `https://${domain}${path}`;
    }

    if (jsonObj.messages) console.log(jsonObj.messages.map(m => m.message).join('\n'));
  },
};
