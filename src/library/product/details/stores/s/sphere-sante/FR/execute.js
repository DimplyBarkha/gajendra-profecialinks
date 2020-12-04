
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    domain: 'sphere-sante.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.goto('https://www.sphere-sante.com/');
    console.log(inputs.id);
    // await context.evaluate('.searchBarHeader .search-input.searchTrack', inputs.id);
    await context.evaluate(async function (inputs) {
      document.querySelector('.searchBarHeader .search-input.searchTrack').value = inputs.id;
    }, inputs);
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.click('.searchfbutton.searchButtonTrack.searchBarHeader-image');
    // await context.click('div.produit-title-rating');
    await context.evaluate(async function (inputs) {
      document.querySelector('div.produit-title-rating').click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
};
