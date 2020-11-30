const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'menards',
    transform: cleanUp,
    domain: 'menards.com',
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
      const originalDiv = document.querySelectorAll('div[class="search-item"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
      const element = nodeSet.snapshotItem(index);
      if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
      };
      var vari = getAllXpath("//div[@class='details']/div/span/text()", 'nodeValue');
      for (let i = 0; i < vari.length; i++) {
        addHiddenDiv('id', vari[i], i);
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
      rankOrganic = (dup * 36) + 1;
    }
    const urlProduct = document.querySelectorAll('div[class="search-item"]');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });


};
