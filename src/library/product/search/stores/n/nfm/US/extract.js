const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    transform,
    domain: 'nfm.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, store, transform: transformParam },
    context,
    dependencies,
  ) => {
    try {
      await context.waitForSelector('img.img-responsive.list.space-bottom-medium');
    } catch (e) {
      console.log(e);
    }
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    }
    await context.evaluate(addUrl);
    return await context.extract(dependencies.productDetails, {
      transform: transformParam,
    });
  },
};
