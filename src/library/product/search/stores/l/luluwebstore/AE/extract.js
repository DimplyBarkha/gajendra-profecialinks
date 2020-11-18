const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'luluwebstore',
    transform: cleanUp,
    domain: 'luluhypermarket.com',
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
      const originalDiv = document.querySelectorAll('div[class="plp-prod-name"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('&')[1];
    try {
      if (checkPageNumber.startsWith('pageNumber=')) {
        rankOrganic = checkPageNumber.replace('pageNumber=', '');
      }
    }
    catch (err) {
    }
    var dup = Number(rankOrganic);
    dup = dup - 1;
    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 60) + 1;
    }
    const urlProduct = document.querySelectorAll('div[class="plp-prod-name"]');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }
    // // let firstChildNode;
    // // const aggregateRating = document.querySelectorAll("div[class='star-rating']")
    // // for (let k = 0; k < aggregateRating.length; k++) {
    // //   let secondChildNode, thirdChildNode = 0;
    // //   firstChildNode = aggregateRating[k].childNodes;
    // //   for (let j = 0; j < firstChildNode.length; j++) {
    // //     secondChildNode = firstChildNode[j].firstChild;
    // //     // @ts-ignore
    // //     if (secondChildNode.childNodes.length) {
    // //       // @ts-ignore
    // //       thirdChildNode = thirdChildNode + secondChildNode.firstChild.firstChild.width.animVal.value;
    // //     }
    // //   }
    //   addHiddenDiv('aggregateRating', thirdChildNode / 20, k);
    // }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}