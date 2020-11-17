const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform: cleanUp,
    domain: 'flaschenpost.de',
    zipcode: '48151',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const usernameElements = document.querySelectorAll('#validZipcode');
      usernameElements.forEach(username => username.value = "48151");
      document.querySelector('button[class="fp-button fp-button--primary zip--button"]').click()
      await new Promise(r => setTimeout(r, 6000));
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }


    });
    return await context.extract(productDetails, { transform });
  },
}