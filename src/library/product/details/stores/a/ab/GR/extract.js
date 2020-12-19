const { cleanUp } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    transform: cleanUp,
    domain: 'ab.gr',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(()=>{
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        }    
        let descriptionBulletPointsExists = document.evaluate(`//div[contains(@class,'ShowMoreLess')]//p[contains(text(),'•')]/br`,document).iterateNext();
        let descriptionBulletCount;
        if(descriptionBulletPointsExists) {
        descriptionBulletCount = document.evaluate(`count(//div[contains(@class,'ShowMoreLess')]//p[contains(text(),'•')]/br)+1`,document).numberValue;      
        } else {        
        descriptionBulletCount = 0 ;
        }     
        addHiddenDiv('descriptionBulletCount' , descriptionBulletCount);
    });
    return await context.extract(productDetails, { transform });
  }
};
