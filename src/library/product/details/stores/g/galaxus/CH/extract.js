const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    transform,
    domain: 'galaxus.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      await context.click('#description button');
      await context.click('#specifications button');
      await context.click('#returnsAndWarranty button');
    } catch (e) {
      console.log(e);
    }

    try {
      await context.focus('a.styled__StyledButton-sc-1b7q9no-1.hPXcsG');
    } catch (e) {
      console.log(e);
    }

    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
