const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'chezmoi.leclerc',
    transform: cleanUp,
    domain: 'chezmoi.leclerc',
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
    // const usernameElements = document.querySelectorAll('#validZipcode');
    // usernameElements.forEach(username => username.value = "48151");
    // document.querySelector('div[class="fp-modal_input"]>button').click()
    // await new Promise(r => setTimeout(r, 6000));

    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }

    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul[id="ulListeProduits"]>li')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('?')[1];
    if(checkPageNumber != null){
      checkPageNumber = checkPageNumber.split("&")[0];
    }
    
    try {
      if (checkPageNumber.startsWith('p=')) {
        rankOrganic = checkPageNumber.replace('p=', '');
      }
    }
    catch (err) {
    }


    var dup = Number(rankOrganic);
    dup = dup - 1; 

    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (dup * 18) + 1;
    }
    const urlProduct = document.querySelectorAll('ul[id="ulListeProduits"]>li');
    for (let i = 0; i < urlProduct.length; i++) {
      addHiddenDiv('rankOrganic', rankOrganic++, i);
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




  });
return await context.extract(productDetails, { transform });
}
