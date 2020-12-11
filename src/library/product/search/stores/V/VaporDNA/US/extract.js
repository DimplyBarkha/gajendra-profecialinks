async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    var button = document.querySelector('div#age-check-prompt button#submit_birthdate');
    button.click();

    let scrolltop = document.getElementById("PageContainer").scrollTop;
    var btn = document.querySelector('div.ais-infinite-hits--showmore > button');

    if (!btn.disabled) {
      //get total results found
      var totalPages = document.getElementsByClassName('ais-stats--nb-results')[0].innerText;
      totalPages = totalPages.match(/\d+/)[0]

      //48 resuls are per page, so calculate number of click required to load all products
      var clickCount = Math.floor(totalPages / 48);
      for (var i = 0; i < clickCount; i++) {
        document.querySelector('div.ais-infinite-hits--showmore > button').click();
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  })
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    transform: null,
    domain: 'vapordna.com',
    zipcode: "''",
  },
  implementation,
};
