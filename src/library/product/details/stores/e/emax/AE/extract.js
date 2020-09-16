const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    transform,
    domain: 'emaxme.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(() => {
        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const description = document.querySelector('div[id="product.info.description"] div[class*=value]').innerHTML;
        const descriptionContent = description.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
        addHiddenDiv('customizeDescription', descriptionContent)
      })
    } catch (e) {
      console.log(e)
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
