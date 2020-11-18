const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    transform: cleanUp,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {

    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul[class="neemu-products-container nm-view-type-grid"]>li')[index];
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
      rankOrganic = (dup * 24) + 1;
    }
    const urlProduct = document.querySelectorAll('ul[class="neemu-products-container nm-view-type-grid"]>li');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}