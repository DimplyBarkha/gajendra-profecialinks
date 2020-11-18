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

    //for rank
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('tbody[class="content"]>tr')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('?');
    let checkPageNumberSeparate = checkPageNumber[1].split('&');
    for (let k = 0; k < checkPageNumberSeparate.length; k++)
    {
      try {
        if (checkPageNumberSeparate[k].startsWith('pn=')) {
          rankOrganic = checkPageNumberSeparate[k].replace('pn=', '');
        }
      }
      catch (err) {
      }
    }
  
    var dup = Number(rankOrganic);
    dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 20) + 1;
    }
    const urlProduct = document.querySelectorAll('tbody[class="content"]>tr');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
    }

  });
  //rank end


  return await context.extract(productDetails, { transform });
}