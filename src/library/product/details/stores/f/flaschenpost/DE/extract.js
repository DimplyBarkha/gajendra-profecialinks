
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform: null,
    domain: 'flaschenpost.de',
    zipcode: '28199',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      try {
        const usernameElements = document.querySelectorAll('#validZipcode');
      // @ts-ignore
      usernameElements.forEach(username => username.value = "28203");
      // @ts-ignore
      document.querySelector('div[class="fp-modal_input"]>button').click()
      await new Promise(r => setTimeout(r, 6000));
        
      } catch (error) {
        
      } 
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