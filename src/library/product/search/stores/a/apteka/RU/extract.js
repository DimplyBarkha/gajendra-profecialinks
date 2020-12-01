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
      const productImages = document.evaluate('//div[@class = "CategoryItemCard__multiple-images"]//div[position() > 1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      const products = document.evaluate('//div[@class = "CategoryItemCard-wrapper"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      for (let i = 0; i < productImages.snapshotLength; i++) {
        productImages.snapshotItem(i).remove();
      }
      console.log(products.snapshotLength);
      for (let i = 0; i < products.snapshotLength; i++) {
        addHiddenDiv('import_search_url', location.href, products.snapshotItem(i));
      }
    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(data, { transform });
  },
};
