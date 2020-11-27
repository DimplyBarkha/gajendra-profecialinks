const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'deliveryextra',
    transform,
    domain: 'clubeextra.com.br',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      var iframe = await context.evaluate(async () => {
        const element = document.querySelector('div#standoutDivAutomatico');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => setTimeout(resolve, 30000));
        }
        iframe = document.querySelector('div#standoutDivAutomatico iframe') ? document.querySelector('div#standoutDivAutomatico iframe').getAttribute('src') : null;
        iframe = 'https:' + iframe;
        return iframe;
      });
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
      if (iframe) {
        await context.goto(iframe);
      }
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform }, { type: 'MERGE_ROWS' });
  },
};
