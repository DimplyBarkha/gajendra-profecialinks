const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    transform: cleanUp,
    domain: 'kmart.com.au',
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
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
    // for rank
    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="product product_box small-6 medium-4 large-4 columns clearfix col "]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    // let checkPageNumber1 = url.split('?')[1];
    let checkPageNumber = url.split('&')[0];
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
    const urlProduct = document.querySelectorAll('div[class="product product_box small-6 medium-4 large-4 columns clearfix col "]');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });


};
