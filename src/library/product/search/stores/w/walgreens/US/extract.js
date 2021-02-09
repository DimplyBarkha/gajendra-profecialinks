const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  { transform: transformParam },
  context,
  dependencies,
) {
  const { productDetails } = dependencies;

  // context.click don't work for this selector 'div.fsrAbandonButton'
  // The statement above needs to be double checked
  await context.evaluate(async () => {
    const popUps = document.querySelector('div.fsrAbandonButton');
    if (popUps) popUps.click();
  });

  // Wait for sponsored products
  await context.waitForSelector('div.card__product figure.sponsored', { timeout: 6000 })
    .catch(() => console.log('No sponsored products were found.'));

  await context.evaluate(async () => {
    // Save url
    const filteredUrl = window.location.href.replace(/%20/g, ' ');
    const urlDiv = document.createElement('div');
    urlDiv.id = 'filtered-url';
    urlDiv.style.display = 'none';
    urlDiv.textContent = filteredUrl;
    document.body.appendChild(urlDiv);

    // remove eventual pop ups
    // TODO: Identify pop ups close button selector and move outside context evaluate
    if (document.querySelector('div.fsrAbandonButton')) {
      document.querySelector('div.fsrAbandonButton').click(); // context.click don't work for this selector 'div.fsrAbandonButton'
    }
    if (document.querySelector('button#fsrFocusFirst')) {
      document.querySelector('button#fsrFocusFirst').click();
      if (document.querySelector('div#fsrInvite') && document.querySelector('div#fsrFullScreenContainer')) {
        document.querySelector('div#fsrFullScreenContainer').remove();
      }
    }

    // read the initial state of the page
    const init = window.getInitialState().searchResult.productList;
    // get the prodID of all the products in the search results
    const productClass = 'card__product';
    const productCardSelector = `.${productClass}`;
    const idPrefix = 'productcard';
    const allProducts = [...document.querySelectorAll(productCardSelector)];
    let allProdIds = allProducts
      .map(prodEl => !prodEl.id ? prodEl.parentElement.parentElement : prodEl)
      .map(u => u.id.replace(idPrefix, ''));

    if (init.length > 0) {
      // @ts-ignore
      allProducts.forEach((prodEl, i) => {
        // Try to match against the initial state
        const idElem = !prodEl.id ? prodEl.parentElement.parentElement : prodEl;
        const id = idElem.id.replace(idPrefix, '');
        const infos = init.find(({ productInfo }) => productInfo.prodId === id);
        if (infos) {
          prodEl.dataset.upc = infos.productInfo.gtin || infos.productInfo.upc;
          prodEl.dataset.id = infos.productInfo.wic;
          // remove from the list
          allProdIds = allProdIds.filter(item => item !== id);
        }
      });
    }
    if (allProdIds.length > 0) {
      // Ask walgreens API for infos if there are any remaining ids
      const response = await fetch('https://www.walgreens.com/productsearch/v1/products/productsInfo', {
        credentials: 'include',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-GB,en;q=0.5',
          'Content-Type': 'application/json; charset=utf-8',
          'x-dtpc': '2$544687158_898h8vESUAATIKHCRLASDHFEIGQETKUNAAHRAR-0e4',
          'Cache-Control': 'max-age=0',
        },
        referrer: 'https://www.walgreens.com/search/results.jsp?Ntt=mouth%20rinse',
        body: JSON.stringify({ products: allProdIds }),
        method: 'POST',
        mode: 'cors',
      });

      if (response && response.status === 404) {
        console.log(`The products ${allProdIds} were not found`);
      }

      if (response && response.status === 200) {
        console.log(`The products ${allProdIds} were found`);
        const data = await response.json();
        data.productList.forEach(({ productInfo }) => {
          const id = `#${idPrefix}${productInfo.prodId}`;
          const elemID = document.querySelector(id);
          const elem = elemID && elemID.classList.contains(productClass) ? elemID : document.querySelector(`${id} ${productCardSelector}`);
          if (elem) {
            elem.dataset.upc = productInfo.gtin || productInfo.upc;
            elem.dataset.id = productInfo.wic;
          }
        });
      }
    }
  });

  return await context.extract(productDetails, { transform: transformParam });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    transform,
    domain: 'walgreens.com',
  },
  implementation,
};
