/* eslint-disable one-var */

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'lidl',
    transform: null,
    domain: 'lidl.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    await context.click('.cookie-alert-extended-button').catch(() => { });
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      const params = new URLSearchParams(location.href);
      const page = parseInt(params.get('page')) || 1;
      const products = document.evaluate('count(//li[contains(@class, "product-grid__item")])', document, null, XPathResult.ANY_TYPE).numberValue;
      const productIds = document.evaluate('//li[contains(@class, "product-grid__item")]//a/@id', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productURLs = document.evaluate('//li[contains(@class, "product-grid__item")]//a/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productNames = document.evaluate('//li[contains(@class, "product-grid__item")]//a/span/strong/text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productImages = document.evaluate('//li[contains(@class, "product-grid__item")]//a/img/@src', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productItems = document.evaluate('//li[contains(@class, "product-grid__item")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

      const ids = [], urls = [], names = [], images = [], ratings = [], ratingCounts = [], prices = [];

      for (let i = 0; i < products; i++) {
        ids.push(productIds.snapshotItem(i).nodeValue);
        urls.push(productURLs.snapshotItem(i).nodeValue);
        names.push(productNames.snapshotItem(i).nodeValue);
        images.push(productImages.snapshotItem(i).nodeValue);
        prices.push(Array.from(Array.from(Array.from(productItems.snapshotItem(i).children[0].children).find(node => node.className === 'price-height').children[0].children).find(node => node.className === 'pricelabel__price').children).find(node => node.className === 'pricelabel__price-middleline').textContent.replace(/(\s|\*|[a-zA-Z])/gm, '').replace('*', '').replace('.', ','));

        const ratingsContainer = productItems.snapshotItem(i).children[0].children[1];
        if (ratingsContainer.childElementCount === 3) {
          let rating = 0;
          const ratingNodes = ratingsContainer.children[2].children[0].children;
          for (let j = 0; j < 5; j++) {
            rating += parseInt(ratingNodes.item(j).className.match(/\d{1,2}/gm)[0]);
          }
          ratings.push((rating / 10).toString().replace('.', ','));
          ratingCounts.push(ratingNodes.item(5).textContent.match(/\d{1,}/gm));
        } else {
          ratings.push('');
          ratingCounts.push(0);
        }
      }
      for (let index = 0; index < products; index++) {
        addHiddenDiv('import_product_ids', ids[index]);
        addHiddenDiv('import_product_urls', urls[index]);
        addHiddenDiv('import_product_searches', location.href);
        addHiddenDiv('import_product_names', names[index]);
        addHiddenDiv('import_product_images', images[index]);
        addHiddenDiv('import_product_rating', ratings[index]);
        addHiddenDiv('import_product_rating_count', ratingCounts[index]);
        addHiddenDiv('import_product_price', prices[index]);
        addHiddenDiv('import_product_rank', index + 36 * (page - 1) + 1);
      }
    });
    return await context.extract(data);
  },
};
