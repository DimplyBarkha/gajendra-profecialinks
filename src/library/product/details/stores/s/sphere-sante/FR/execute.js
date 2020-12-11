
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    domain: 'sphere-sante.com',
    loadedSelector: null,
    noResultsXPath: '//div[@class="row alert red alert-danger" and contains(., "Aucun produit ne correspond à votre recherche")]',
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
    await context.click('.searchfbutton.searchButtonTrack.searchBarHeader-image');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // await context.click('div.produit-title-rating');
    // await context.evaluate(async function () {
    await context.click('div.produit-title-rating');
    // });
    await new Promise((resolve, reject) => setTimeout(resolve, 15000));
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, parameters.noResultsXPath);
  },
};
