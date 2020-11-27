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
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        await context.evaluate(async () => {
          const element = document.querySelector('div#standoutDivAutomatico');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            await new Promise((resolve) => setTimeout(resolve, 30000));
            const element1 = Array.from(document.querySelectorAll('div#standoutDivAutomatico iframe div[class*=box] img src'));
            addHiddenDiv('element1', element1);
          }
        });
      });
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
