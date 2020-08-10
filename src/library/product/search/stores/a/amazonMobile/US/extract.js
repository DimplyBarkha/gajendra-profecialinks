const { transform } = require('../../../../transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForXPath('//div/@data-asin');
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    const nodesSnapshot = document.evaluate('//div[contains(@data-component-type,"s-search-result") and not(contains(@class, "AdHolder"))][@data-asin]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const paginationDiv = document.querySelector('.s-desktop-toolbar');
    let pageStartIndex = paginationDiv ? paginationDiv.innerText.match(/\d+/) : 0;
    pageStartIndex = pageStartIndex ? +pageStartIndex[0] : 1;
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
      addElementToDocument(nodesSnapshot.snapshotItem(i), 'pd_rank', pageStartIndex);
      addElementToDocument(nodesSnapshot.snapshotItem(i), 'searchUrl', searchUrl);
      pageStartIndex++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    zipcode: '',
    transform,
    domain: 'amazon.com',
  },
  implementation,
};
