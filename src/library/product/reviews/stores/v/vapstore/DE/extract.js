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

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'vapstore',
    transform,
    domain: 'vapstore.de',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;

    await context.evaluate(async () => {
      var review = document.querySelector('div#article-tabs div#tab-votes div.panel-heading span');
      if(review){
      	review.click();
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      var select = document.querySelector('#ratings_nItemsPerPage');
      if(select){
            select.value = -1;
         //   select.dispatchEvent(new Event('change'));
               select.addEventListener('change',function(){
                  console.log('changed');
                });
               
      }     
    });
    await context.waitForNavigation();
    return await context.extract(productReviews);
  },
};
