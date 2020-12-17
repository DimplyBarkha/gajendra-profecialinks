const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    context.waitForSelector('#dyson_jump_features', {timeout: 30000});
 } catch(error){
      console.log('dyson_jump_features not found');
 }
  const waitSelector = await context.evaluate(()=>{
    return document.querySelector('#dyson_jump_features')? true:false ;
  })
  if(waitSelector){
  await context.evaluate(()=>{
    document.querySelector('.inpage_block.inpage_selector_feature').scrollIntoView({behavior: "smooth"});
  })
  }
  await context.evaluate(async function () {
   
    if (document.querySelector('#category-grid > div[data-position="1"]')) {
        document.querySelector('#category-grid > div > div > div.photo-box > a').click();
      }
   
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch sku number and gtin from script tag as not available directly on DOM.
    function fetchRatingFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@type="application/ld+json"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const availability = scriptTagData.includes('InStock') ? "In Stock" : "Out of Stock"; //checking for schemaOrg
      addHiddenDiv('added_availability', availability);
    }

    // If images are present in description then add to manufacturerDescription else add to description
    const descriptionSelector = document.evaluate('//*[@id="productDescription"] | //span[contains(text(), "Description")]/parent::*/following-sibling::* |  //div[contains(@class, "product-short-description short-description")]/p | //div[contains(@id,"dyson_jump_features")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description ? description.replace(/(\n\s*){2,}/g, ' ').replace(/(\n\s*){1,}/g, ' || ') : '';
    const manufacturerImageFlag = document.querySelector('div[class="box-description cms"] img');
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
    fetchRatingFromScript();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    transform,
    domain: 'domayne.com.au',
    zipcode: '',
  },
  implementation,
};
