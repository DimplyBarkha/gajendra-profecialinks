const { transform } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
        // while(!!document.querySelector('#search-grid_0 > div.col-12.bloom-load-wrapper > button')){
        // document.querySelector('#search-grid_0 > div.col-12.bloom-load-wrapper > button').click()
        try{
        document.querySelector('#cookies-modal-id > div > div.button-container > a.accept-btn.js-accept').click()
        await new Promise(r => setTimeout(r, 6000));
        // }
        }
        catch(error)
        {

        }
        
    })
    return await context.extract(productDetails, { transform });
}
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'GR',
        store: 'hondoscenter',
        transform: transform,
        domain: 'hondoscenter.com',
        zipcode: '',
    },
    implementation,
};