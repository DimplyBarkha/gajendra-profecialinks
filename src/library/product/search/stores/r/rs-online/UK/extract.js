const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    transform: cleanUp,
    domain: 'uk.rs-online.com',
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

    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('tr[class="resultRow"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('&')[3];
    try {
      if (checkPageNumber.startsWith('pn=')) {
        rankOrganic = checkPageNumber.replace('pn=', '');
      }
    }
    catch (err) {
    }


    var dup = Number(rankOrganic);
    dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 20) + 1;
    }
    // const urlProduct = document.querySelectorAll('tr[class="resultRow"]');
    for (let i = 1; i < 21; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }

  });
  //rank end


  return await context.extract(productDetails, { transform });
}