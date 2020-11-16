const { transform } = require('../format');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    if (document.querySelector('#KameleoonScenarioLayerCloseButton34896')) {
      document.querySelector('#KameleoonScenarioLayerCloseButton34896').click()
    }

  } catch (error) {
    console.log('no close button found');
  }

  try {
    await context.waitForSelector('#Flixmedia', { timeout: 50000 });
   
    
  } catch (error) {
  console.log('no enhanced content found');
}


// If cookie pop up appears then clicking on accept button
await context.evaluate(async function () {
  function addHiddenDiv(id, content) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
  }

  if (document.querySelector('div.productStrate__raw')) {
    let desc = document.querySelector('div.productStrate__raw').innerHTML;
    desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
    addHiddenDiv('desc', desc);
  }

  let desc = document.querySelector('script[type="application/ld+json"]').innerText
  desc = JSON.parse(desc);
  if (desc.brand) {
    addHiddenDiv('brandText', desc.brand.name);
  }


  try {


    let scrollSelector = document.querySelector('#footer');
    // @ts-ignore
    let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
    let yPos = 0;
    while (scrollLimit && yPos < scrollLimit) {
      yPos = yPos + 350;
      window.scrollTo(0, yPos);
      scrollSelector = document.querySelector('#footer');
      // @ts-ignore
      scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      await new Promise(resolve => setTimeout(resolve, 3500));
    }

  } catch (e) {
    console.log('No content found');
  }




});
// try {
//   await context.waitForXPath('//div[contains(@class,"inpage_selector_info dyson_introduction") or contains(@class,"inpage_block inpage_selector_feature")]');
// } catch (error) {
//   console.log('no video found');
// }

await new Promise((resolve) => setTimeout(resolve, 10000));
return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
  implementation
};
