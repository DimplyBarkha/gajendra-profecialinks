const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform,
    domain: 'meny.no',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      // const { transform } = parameters;
      const informationDiv = document.createElement('div');
      informationDiv.className = 'information';
      const manufacturerInfo = document.querySelector('ul[class*="manufacturer-info"] > li:first-child > strong');
      if (manufacturerInfo) {
        informationDiv.setAttribute('manufacturer', manufacturerInfo.innerText)
      }
      const info = document.querySelectorAll('ul[class*="manufacturer"] > li > strong');
      if (info.length) {
        [...info].forEach((elem) => {
          if (elem.innerText == 'Merke:') {
            const actualDiv = elem.parentElement;
            const brand = actualDiv.innerText.replace(/(.+)(:)(.+)/g, '$3');
            informationDiv.setAttribute('brand', brand.trim())
          }
          if (elem.innerText == 'EAN:') {
            const actualDiv = elem.parentElement;
            const ean = actualDiv.innerText.replace(/(.+)(:)(.+)/g, '$3');
            informationDiv.setAttribute('ean', ean.trim())
          }
        })
      }
      
      document.body.append(informationDiv);

      var country= document.evaluate(`(//span[contains(@class,"ngr-tooltip__button-wrapper")])[1]`, document).iterateNext().textContent;
      if(country)
      {
      var countrydiv = document.createElement('div')
      countrydiv.setAttribute('country',country)
      document.body.append(countrydiv);
      }
      const Ingredients= document.querySelector('div[class="ws-product-data__content"] > p');
      if(Ingredients)
      {
      var Ingredientsdiv = document.createElement('div')
      Ingredientsdiv.setAttribute('Ingredients',Ingredients.innerHTML);
      document.body.append(Ingredientsdiv);
      }

      const data = document.querySelector('p[class="product-details__unavailable"]');
      var availDiv = document.createElement('div')
      availDiv.className = 'availability';
      if(data){
        availDiv.setAttribute('availability',"Out of Stock");
      }
      else{
       availDiv.setAttribute('availability',"In stock");
       }
       document.body.append(availDiv);
      const informationButtons = document.querySelectorAll('div[class*="product-details"] > button > span');
      if (informationButtons.length) {
        const nutritionButton = [...informationButtons].find(elem => elem.innerText == 'Næringsinnhold');
        if (nutritionButton) {
          nutritionButton.click();
          await new Promise(res => setTimeout(res, 10000))
        }
      }
    })
    return await context.extract(productDetails, { transform });
  },
};