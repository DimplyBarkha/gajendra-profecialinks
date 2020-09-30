const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform: transform,
    domain: 'beru.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.click(".8e1055a9 svg").catch(() => { })
    await context.click("._2208w4aQVn button").catch(() => { })
    return await context.extract(data, { transform });
  }
};
