const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    transform: cleanUp,
    domain: 'komus.ru',
    zipcode: '',
  }, implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="b-productList__item__picture"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('page=')) {
          rankOrganic = checkPageNumber.replace('page=', '');
        }
      }
      catch (err) {
      }
      var dup = Number(rankOrganic);
      dup = dup - 1;
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (dup * 30) + 1;
      }
      const urlProduct = document.querySelectorAll('div[class="b-productList__item__picture"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
