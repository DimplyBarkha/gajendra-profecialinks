const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };  
  return cleanUp(data);
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  try {
    await context.waitForSelector('a[class="button confirmm-age"]', { timeout: 7000 });
  } catch (e) {
    console.log('age selector not found');
  }

  await context.evaluate(async function () {
    const ageConfIframe = document.querySelector('a.button.confirmm-age');
    if (ageConfIframe) {
      document.querySelector('a.button.confirmm-age').click();
    }
    return !!ageConfIframe;
  });


  await new Promise(resolve => setTimeout(resolve, 10000));

  try{
    await context.waitForSelector('div[data-review-id]:not(.yotpo-hidden)');
  }
  catch(e){
    console.log('selector not found', e);
  }
/*
  await context.evaluate(async function () {
    var parentel = document.querySelector('div[data-review-id]:not(.yotpo-hidden)');
    if(parentel){
      console.log("============================================================");
      var childel = parentel.querySelector('div.content-title.yotpo-font-bold');
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",childel.innerText);
    }
  });
*/



  // const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    transform,
    domain: 'shop.njoy.com',
    zipcode: "''",
  },
  implementation,
};
