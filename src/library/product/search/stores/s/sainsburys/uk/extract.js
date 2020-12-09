const { transform } = require('../../../../shared');
// const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: transform,
    domain: 'sainsburys.co.uk',
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
      const originalDiv = document.querySelectorAll('a[class="pt__link"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let firstChildNode;
    let finalaggregateRating;
    const aggregateRating = document.querySelectorAll("div[class='star-rating']")
    for (let k = 0; k < aggregateRating.length; k++) {
      let secondChildNode, thirdChildNode = 0;
      firstChildNode = aggregateRating[k].childNodes;
      for (let j = 0; j < firstChildNode.length; j++) {
        secondChildNode = firstChildNode[j].firstChild;
        console.log(secondChildNode)
        // @ts-ignore
        if (secondChildNode.childNodes.length) {
          // @ts-ignore
          thirdChildNode = thirdChildNode + secondChildNode.firstChild.firstChild.width.animVal.value;
          console.log(thirdChildNode)
          finalaggregateRating= thirdChildNode/20
        }
      }
      addHiddenDiv('aggregateRating', finalaggregateRating, k);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}