const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    let scrolltop = document.getElementById('main').scrollTop;

    while (document.querySelector('div.btn-view-more-products > button')) {
      document.querySelector('div.btn-view-more-products > button').click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    document.getElementById('main').scrollBy({ top: 1000, left: 0, behavior: 'smooth' });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const thmcount = document.querySelectorAll('ul.productGroup li.item img[src]').length;
    const itemcount = document.querySelectorAll('ul.productGroup li.item').length;

    while (itemcount != thmcount) {
      const newscrolltop = document.getElementById('main').scrollTop;
      document.getElementById('main').scrollBy({ top: newscrolltop - scrolltop, left: 0, behavior: 'smooth' });
      scrolltop = newscrolltop;
      await new Promise(r => setTimeout(r, 500));
      const newthmcount = document.querySelectorAll('ul.productGroup li.item img[src]').length;
      const newitemcount = document.querySelectorAll('ul.productGroup li.item').length;
      if (newthmcount == newitemcount) {
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    store: 'migros',
    transform: null,
    domain: 'migros.ch',
    zipcode: '',
  },
  // implementation,
};
