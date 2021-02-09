const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'apteka',
    transform,
    domain: 'apteka.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.click('.TownSelector button.icon-close')
      .catch(() => { });
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content, container) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        container.appendChild(newDiv);
      };
      await new Promise(resolve => setTimeout(resolve, 10000));
      const nextBtn = document.querySelector('.pager-v3-next.disabled');
      if (nextBtn) {
        nextBtn.remove();
      }
      const products = document.evaluate('//div[@class = "ViewSearch__items"]//div[@class = "CategoryItemCard-wrapper"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const isProductPage = document.querySelector('.ViewProductPage');
      const productIds = document.evaluate('//div[@class = "ViewSearch__items"]//a[@class = "CategoryItemCard__title"]/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productDetailsId = document.evaluate('//meta[@itemprop = "sku"]/@content', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productImages = document.evaluate('//div[@class = "ViewSearch__items"]//a[contains(@class, "CategoryItemCard__image")]//img/@src', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const productDetailsImage = document.evaluate('//div[contains(@class, "ProductPhotos")]//img/@src', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      for (let i = 0; i < products.snapshotLength; i++) {
        const pdtId = productIds.snapshotItem(i).nodeValue.replace(/.*-(.*)\/$/, '$1');
        const pdtURL = productIds.snapshotItem(i).nodeValue.replace(/(.+)/, 'https://apteka.ru$1');
        addHiddenDiv('import_search_url', location.href, products.snapshotItem(i));
        addHiddenDiv('import_product_id', pdtId, products.snapshotItem(i));
        addHiddenDiv('import_product_url', pdtURL, products.snapshotItem(i));
        addHiddenDiv('import_product_image', productImages.snapshotItem(i).nodeValue, products.snapshotItem(i));
      }
      if (isProductPage) {
        const pdtImage = productDetailsImage.snapshotItem(0).nodeValue.replace(/(.*)preview_(.*)/, '$1original_$2');
        addHiddenDiv('import_search_url', location.href, isProductPage);
        addHiddenDiv('import_product_id', productDetailsId.snapshotItem(0).nodeValue, isProductPage);
        addHiddenDiv('import_product_url', location.href, isProductPage);
        addHiddenDiv('import_product_image', pdtImage, isProductPage);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(data, { transform });
  },
};
