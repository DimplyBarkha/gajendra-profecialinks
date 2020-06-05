async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  //start my code
  async function getElementsOnPage() {
    return await context.evaluate(() => {
      return document.getElementsByClassName('kds-Text--m text-default-800 mt-12 mb-4 font-500').length;
    });
  }

  let currentElCount = await getElementsOnPage();

  let totalElCount = currentElCount;

  //add indices for RankOrganic
  await context.evaluate(async (totalElCount) => {
    let items = document.querySelectorAll('div.ProductCard-promoContainer.-mx-12');

    items.forEach((item, index) => {
      let ranking = document.createElement('li');
      ranking.classList.add('current-rank');
      ranking.textContent = index + 1 + totalElCount;
      ranking.style.display = 'none';
      item.append(ranking);
    });
  }, JSON.parse(totalElCount))


  //end my code



  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: null,
    domain: 'kroger.com',
  }, implementation
};
