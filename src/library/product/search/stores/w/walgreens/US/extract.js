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

  // scroll to the bottom of the page
  await context.evaluate(async () => {
    document.querySelector('footer') && document.querySelector('footer').scrollIntoView();
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

    const allProducts = [...document.querySelectorAll(productCardSelector)]
      .map(elem => ({
        elem,
        id: (!elem.id ? elem.parentElement.parentElement : elem).id.replace(idPrefix, ''),
        notDone: true,
      }));
    const processItem = objWithData => (item) => {
      const { elem, id } = item;
      // Try to match against the initial state
      const infos = objWithData.find(({ productInfo }) => productInfo.prodId === id);
      if (infos) {
        elem.dataset.upc = infos.productInfo.gtin || infos.productInfo.upc;
        elem.dataset.id = infos.productInfo.wic;
        // remove from the list
        item.notDone = false;
      }
    };
    if (init.length > 0) allProducts.forEach(processItem(init));

    const remainingProds = allProducts.filter(obj => obj.notDone);

    if (remainingProds.length > 0) {
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
        body: JSON.stringify({ products: remainingProds.map(obj => obj.id) }),
        method: 'POST',
        mode: 'cors',
      });

      if (response && response.status === 404) {
        console.log('The products %o were not found', remainingProds);
      }

      if (response && response.status === 200) {
        console.log('The products %o were found', remainingProds);
        const data = await response.json();
        remainingProds.forEach(processItem(data.productList));
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
