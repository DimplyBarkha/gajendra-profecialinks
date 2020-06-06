async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  async function getElementsOnPage() {
    return await context.evaluate(() => {
      return document.getElementsByClassName('kds-Text--m text-default-800 mt-12 mb-4 font-500').length;
    });
  }

  const currentElCount = await getElementsOnPage();

  const totalElCount = currentElCount;

<<<<<<< HEAD
  // add indices for RankOrganic
  await context.evaluate(async (totalElCount) => {
    const items = document.querySelectorAll('div.ProductCard-promoContainer.-mx-12');

    items.forEach((item, index) => {
      const ranking = document.createElement('li');
      ranking.classList.add('current-rank');
      ranking.textContent = index + 1 + totalElCount;
      ranking.style.display = 'none';
      item.append(ranking);
    });
  }, JSON.parse(totalElCount));
=======



>>>>>>> b57c2cbbd0fe9c99e7519535e10dbfae49b501dc

  // end my code

  return await context.extract(productDetails, { transform });
}

<<<<<<< HEAD
=======
const { transform } = require('../../../../shared');

>>>>>>> b57c2cbbd0fe9c99e7519535e10dbfae49b501dc
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: transform,
    domain: 'kroger.com',
  },
  implementation,
};
