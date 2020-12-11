async function implementation (
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
    while(!btn.disabled){
      document.querySelector('div.ais-infinite-hits--showmore > button').click();
      await new Promise(r => setTimeout(r, 1000));
    }
  })
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'VaporDNA',
    transform: null,
    domain: 'vapordna.com',
    zipcode: "''",
  },
  implementation,
};
