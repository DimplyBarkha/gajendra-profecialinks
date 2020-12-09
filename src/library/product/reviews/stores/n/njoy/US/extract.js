async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, mergeType } = parameters;
  const { productReviews } = dependencies;
try{
  await context.waitForSelector('a[class="button confirmm-age"]', { timeout: 7000 });
}
catch(e){
	console.log("--------");
}
  let agebutton = await context.evaluate(async function () {

    const ageConfIframe = document.querySelector('a.button.confirmm-age');
     if(ageConfIframe){
     	document.querySelector('a.button.confirmm-age').click();
    	//await context.click('a.button.confirmm-age');
    // await context.waitForNavigation();
  	}
    return !!ageConfIframe;
  });

  console.log(">>>>>>>>>>>>>>>>>>>>>>>", !!agebutton);

 

  await new Promise(resolve => setTimeout(resolve, 10000));

  try{
    await context.waitForSelector('div[data-review-id]:not(.yotpo-hidden)');
  }
  catch(e){
    console.log('selector not found', e);
  }

  await context.evaluate(async function () {
    var parentel = document.querySelector('div[data-review-id]:not(.yotpo-hidden)');
    if(parentel){
      console.log("============================================================");
      var childel = parentel.querySelector('div.content-title.yotpo-font-bold');
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",childel.innerText);
    }
  });




  // const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    transform: null,
    domain: 'shop.njoy.com',
    zipcode: "''",
  },
  implementation,
};
