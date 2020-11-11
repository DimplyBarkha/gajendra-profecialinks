
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform: null,
    domain: 'kalunga.com.br',
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
      const outOfStock = document.querySelector('#imgProdutoIndisponivel');
      if (!outOfStock) {
        addElementToDocument('availabilityText', 'In Stock');
      }
    });

    return await context.extract(productDetails, { transform });
  }
};
