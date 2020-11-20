const { transform } = require('../format.js');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    
    //document.querySelectorAll('.container div[class*="css-1tv6bwe"] section.accordion .accordion-trigger').forEach(button => button.click());
   
    document.querySelectorAll('.container div[class*="css-uirvwh"] section#product-detail-accordion-0 .accordion-trigger').forEach(button => button.click());
    
    document.querySelectorAll('.container div[class*="css-uirvwh"] section#product-detail-accordion-1 .accordion-trigger').forEach(button => button.click());
    
    document.querySelectorAll('.container div[class*="css-uirvwh"] section#product-detail-accordion-2 .accordion-trigger').forEach(button => button.click());
       
    //document.querySelectorAll('div.container div#gallery div.css-vglb07 li.css-ulwhnf img').forEach(button => button.click());
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    transform: transform,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
  implementation,
};