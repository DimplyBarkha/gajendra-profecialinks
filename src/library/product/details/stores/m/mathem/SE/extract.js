const { cleanUp } = require('../../../../shared');
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
      const originalDiv = document.querySelectorAll("div")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let firstChildNode;
    const aggregateRating = document.querySelectorAll("div[class='full-width'] i[class='fa fa-star']").length
      addHiddenDiv('aggregateRating',aggregateRating ,0);
    // }
    // const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
    // const jsondata = JSON.parse(rawdata);
    // const url = jsondata.offers.availability;


      // addHiddenDiv('url',url);
  });
  //rank end
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    transform: cleanUp,
    domain: 'mathem.se',
    zipcode: '',
  },
  implementation
};