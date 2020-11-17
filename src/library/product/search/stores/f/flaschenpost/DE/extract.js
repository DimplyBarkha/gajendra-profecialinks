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
      document.querySelector('div[class="fp-modal_input"]>button').click()
      await new Promise(r => setTimeout(r, 6000));
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="fp-productList_content"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('p=')) {
          rankOrganic = checkPageNumber.replace('p=', '');
        }
      }
      catch (err) {
      }
      var dup = Number(rankOrganic);
      dup = dup - 1;

      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (dup * 100) + 1;
      }
      const urlProduct = document.querySelectorAll('div[class="fp-productList_content"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
}