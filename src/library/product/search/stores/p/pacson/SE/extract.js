const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    transform: cleanUp,
    domain: 'pacson.se',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('li[class="product-list__item columns small-12 medium-2"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('&')[1];
    try {
      if (checkPageNumber.startsWith('page=')) {
        rankOrganic = checkPageNumber.replace('page=', '');
      }
    }
    catch (err) {
    }

    var dup = Number(rankOrganic);
    dup = dup - 1; 
    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 24) + 1;
    }
    const urlProduct = document.querySelectorAll('li[class="product-list__item columns small-12 medium-2"]');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
  });
  return await context.extract(productDetails, { transform });
}