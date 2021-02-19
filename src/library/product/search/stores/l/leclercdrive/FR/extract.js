const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclercdrive',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '982002',
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
  await context.evaluate(() => {
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class='divWCRS310_Content']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // @ts-ignore
    let scriptDataRaw = $('script:contains("lstEnfants")')[0].innerText;
    var ProductURLs = [], ProductIDs = [];
    let tempURL;
    let scriptData = scriptDataRaw.split('sUrlPageProduit":"');
    for (let i = 1; i < scriptData.length; i++) {
      if (scriptData[i].includes('fiche-produits-')) {
        ProductURLs.push(scriptData[i].split('"')[0]);
        tempURL = scriptData[i].split('"')[0];
        tempURL = tempURL.split('fiche-produits-')[1];
        ProductIDs.push(tempURL.split('-')[0]);
      }
    }
    for (let j = 0; j < ProductIDs.length; j++) {
      addHiddenDiv('ProductIDs', ProductIDs[j], j);
      addHiddenDiv('ProductURLs', ProductURLs[j], j);
    }
  });
  return await context.extract(productDetails, { transform });
}

