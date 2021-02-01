const {transform}=require('../KZ/format.js')
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
  

  function addHiddenDiv (id, content) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
  }

  try{
    await context.evaluate(function() {
      let iframeData=document.querySelector('iframe[title="Product showcase"][loading="eager"]');
      if(iframeData){
        let contentdoc=iframeData.getAttribute('srcdoc');
        const newDiv = document.createElement('div');
        newDiv.id = 'customIframeData';
        newDiv.innerHTML = contentdoc
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    })
  }catch(e){
    console.log('................................commint to error iframe data.........................');
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'KZ',
    store: 'technodom',
    transform,
    domain: 'technodom.kz',
    zipcode: '',
  },
  implementation
};
