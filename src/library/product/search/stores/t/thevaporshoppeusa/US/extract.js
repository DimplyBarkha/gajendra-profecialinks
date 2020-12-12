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
  for (const { group } of data) {
    for (const row of group) {
     
      if (row.productUrl) {
        row.productUrl.forEach(item => {          
          item.text = 'https://thevaporshoppeusa.com'+ item.text
        });
      }  
    }
  }
  return cleanUp(data);
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const pageLoader = 'div.product-listing.row';
  const ageBtn = 'button#bouncer_modal_submit';
  
  const isSelectorAvailable = async (cssSelector) => {
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    await context.waitForSelector(pageLoader, { timeout: 5000 });

    const ageBtnAvailable = await isSelectorAvailable(ageBtn);
    if (ageBtnAvailable) {
      await context.click(ageBtn);
    }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    transform,
    domain: 'thevaporshoppeusa.com',
    zipcode: "''",
  },
  implementation, 
};
