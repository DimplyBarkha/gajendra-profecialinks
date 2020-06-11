const { transform } = require('./transform');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
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
  const { productDetails } = dependencies;
  
  async function getVariants() {
    let variants = await context.evaluate(function() {
        let variantList = [];
        let elements = document.querySelectorAll("li[data-defaultasin]");
        for( var i = 0; i<elements.length; i++ ) {

          console.log(i);
          let element = elements[i];
          if( element == null ) {
            continue;
          }
          let vasin = element.getAttribute("data-defaultasin");
          if( vasin != "" ) {
            variantList.push(vasin);
          }
        }

        return variantList;
    });
    return variants;
  };

  console.log("getting variants");
  let allVariants = await getVariants();
  //if( allVariants.length > 1 ) {
  //  allVariants.shift();
  //}
  const data = await context.extract(productDetails, {transform, type:"APPEND"});
  console.log(allVariants);
  //start at 1 to skip the first variant which is this page
  for( var i = 1; i<allVariants.length; i++ ) {
    let id = allVariants[i]
    let url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });

    const data = await context.extract(productDetails, {transform, type:"APPEND"});
    let pageVariants = await getVariants();
    for( var j = 0; j<pageVariants.length; j++ ) {
      let pageVariant = pageVariants[j];
      if( allVariants.indexOf(pageVariant) == -1 ) {
        allVariants.push(pageVariant);
        console.log("new variant: " + pageVariant);
        console.log(allVariants);
      }
    }

  }


  //return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation
};