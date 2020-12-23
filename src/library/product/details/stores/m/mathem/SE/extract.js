
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    transform: null,
    domain: 'mathem.se',
    zipcode: '',
  },
  implementation
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
      const originalDiv = document.querySelectorAll("i[class='fa fa-star']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let firstChildNode;
    let finalaggregateRating;
    const aggregateRating = document.querySelectorAll("i[class='fa fa-star']")
    for (let k = 0; k < aggregateRating.length; k++) {
      let secondChildNode, thirdChildNode = 0;
      firstChildNode = aggregateRating[k].length;
      // for (let j = 0; j < firstChildNode.length; j++) {
      //   secondChildNode = firstChildNode[j].firstChild;
      //   console.log(secondChildNode)
      //   // @ts-ignore
      //   if (secondChildNode.childNodes.length) {
      //     // @ts-ignore
      //     thirdChildNode = thirdChildNode + secondChildNode.firstChild.firstChild.width.animVal.value;
      //     console.log(thirdChildNode)
      //     finalaggregateRating= thirdChildNode/20
      //   }
      // }
      addHiddenDiv('aggregateRating', firstChildNode, k);
    }
  });
  //rank end
  return await context.extract(productDetails, { transform });
}