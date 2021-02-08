/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });
  await context.setJavaScriptEnabled(true);
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  try{
    await context.waitForSelector('div#product-tabs div.swiper-slide-next');
    await context.click('div#product-tabs div.swiper-slide-next');
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerHTML = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const myCustomProductDescriptionSpecification=document.querySelector('div.product-info').innerHTML;
      if(myCustomProductDescriptionSpecification!=''){
        addElementToDocument('myCustomProductDescriptionSpecification',myCustomProductDescriptionSpecification);
      }
    })
  }catch(e){

  }

  try{
    await context.waitForSelector('div#product-tabs div[class="swiper-slide"]');
    await context.click('div#product-tabs div[class="swiper-slide"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerHTML = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const myCustomReveiwRating=document.querySelector('div[class^="cell reviews-list-module_content-rating"]>div').innerHTML;
      if(myCustomReveiwRating!=''){
        addElementToDocument('myCustomReveiwRating',myCustomReveiwRating);
      }
    })
  }catch(e){

  }
  

  try{
    await context.waitForSelector('div#product-tabs div.swiper-slide-active');
    await context.click('div#product-tabs div.swiper-slide-active');
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }catch(e){

  }

  try{
    await context.evaluate(function () {
      let availability=document.querySelector('div.buybox-actions button.add-to-cart-button');
      let availabilityVal=availability.getAttribute('class');
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerHTML = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      addElementToDocument('myCustomAvailabilityVal','In Stock');
    })
  }catch(e){

  }
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ZA',
    store: 'takealot',
    domain: 'takealot.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
