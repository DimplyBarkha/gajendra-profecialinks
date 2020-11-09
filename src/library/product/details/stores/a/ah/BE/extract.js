const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform: null,
    domain: 'ah.be',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      //Gets brand link
      const brandLink = document.querySelector('.brand-button');
      if (brandLink) {
        addElementToDocument('ah_brandLink', brandLink.href);
      }

      // find storage collapsible block and click on it
      // @ts-ignore
      const colapsibleBlock = [...document.querySelectorAll('.collapsible-block-header_content__1Uv_0')]
      
      colapsibleBlock.find(block => block.innerText === 'Bewaren').click()
    });

    return await context.extract(productDetails, { transform });
  }
};
