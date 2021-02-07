async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('#address-modal').catch(()=>{console.log('Pop-up not appeared')});
  await context.click('.container-title .btn-container i').catch(()=>{console.log('Pop-up not appeared')});
  await context.waitForSelector('.content-img img').catch(()=>{console.log('Product page not appeared')});
  const btnSel = 'div[class*="btn-container"] *';
  let btnPresent = false;
  try {
    await context.waitForSelector(btnSel);
    btnPresent = true;
  } catch(err) {
    console.log('got some error while waiting for button', err.message);
    try {
      await context.waitForSelector(btnSel);
      btnPresent = true;
    } catch(error) {
      console.log('got some error while waiting for button, again', error.message);
    }
  }
  console.log('btnPresent', btnPresent);
  if(btnPresent) {
    await context.evaluate(async (btnSel) => {
      console.log('need to click btnSel', btnSel);
      let elm = document.querySelectorAll(btnSel);
      if(elm && elm.length > 0) {
        elm[0].click();
        console.log('clicked the btn');
      }
    }, btnSel);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  let check404Sel = '*[class*="not-found-box"]';
  let notFoundBoxPresent = false;
  try {
    await context.waitForSelector(check404Sel);
    notFoundBoxPresent = true;
  } catch(err) {
    console.log('did not found 404', err.message);
  }
  if(notFoundBoxPresent) {
    return await context.extract(productDetails, { transform });
  }
  let prodPageLoaded = false;
  let maxTime = 120000;
  let thisTime = 0;
  let imageSel = '.content-img img';
  while((!prodPageLoaded) && (thisTime < maxTime)) {
    prodPageLoaded = await context.evaluate(async (imageSel) => {
      let elm = document.querySelectorAll(imageSel);
      if(elm && elm.length > 0) {
        return true;
      }
      return false;
    }, imageSel);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('prodPageLoaded', prodPageLoaded);
    thisTime += 10000;
  }
  console.log('waited for', thisTime);

  let productTitleSel = 'div[class*="info-product"] *[class*="product-name"]';
  thisTime = 0;
  while((!prodPageLoaded) && (thisTime < maxTime)) {
    prodPageLoaded = await context.evaluate(async (productTitleSel) => {
      let elm = document.querySelectorAll(productTitleSel);
      if(elm && elm.length > 0) {
        return true;
      }
      return false;
    }, productTitleSel);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('prodPageLoaded', prodPageLoaded);
    thisTime += 10000;
  }
  console.log('waited for', thisTime);
  
  if(!prodPageLoaded) {
    throw new Error('product page not loaded - throwing error');
  }
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'rappi_heb',
    transform: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
  implementation,
};
