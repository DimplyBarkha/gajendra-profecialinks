/**
 *
 * @param { { assign_quantity: any, collected: any } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productOffers } = dependencies;
  const assignQuantity = inputs.assign_quantity;
  const collected = inputs.collected

  // Adding data to page
  await context.evaluate(async function (collected, assignQuantity) {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    // Assigning "getInventory" attribute to AMAZON offers
    if(collected<assignQuantity){
      let offers = document.querySelectorAll('#olpOfferListColumn div.olpOffer')
      let currentOffer = collected
      offers.forEach(offer=>{ 
        currentOffer++
        if(currentOffer<=assignQuantity){
          offer.setAttribute('getinventory', 'true');
        } 
      })
    }

    // Adding current page url
    const currentPageUrl = window.location.href;
    const currentPageDiv = document.querySelector('#currentPageUrl');
    currentPageDiv ? currentPageDiv.textContent = currentPageUrl : addElementToDocument('currentPageUrl', currentPageUrl);
  }, collected, assignQuantity);

  return await context.extract(productOffers, { transform });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'assign_quantity',
      description: 'number of sellers that will be assigned a quantity TRUE boolean',
      type: 'string',
    },
    {
      name: 'collected',
      description: 'number of rows collected already',
      type: 'string',
    },
  ],
  dependencies: {
    productOffers: 'extraction:product/offers/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
