const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'tokmanni',
    transform: cleanUp,
    domain: 'tokmanni.fi',
    zipcode: '',
  },
  implementation: async (inputs,
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
        // const originalDiv = document.querySelectorAll("div[class='list-item relative']")[index];
        // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      // var skuID = document.querySelector('div.klevuImgWrap a').getAttribute('onmousedown').split(',');
      // var id = skuID[8];
      // var id1 = id.split(':');
      // id = id1[1];
      // id=id.replace('}', "")
      // console.log(id)
      // addHiddenDiv('skuid', id)
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
      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (parseInt(rankOrganic) * 36) + 1;
      }
    });
    return await context.extract(productDetails, { transform });
  },
};