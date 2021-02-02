
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: null,
    domain: 'asos.com',
    zipcode: "''",
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    await context.evaluate(async () => {
      const urlElement = document.querySelector('meta[property="og:url"]');
      const url = urlElement && urlElement.getAttribute('content');
      const id = url.replace(/(.+)(\/prd\/)(\d+)/g, '$3');
      
      const apiLink = `https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=${id}&store=ROW&currency=GBP&keyStoreDataversion=j42uv2x-26`;
      console.log('URL', apiLink);
      const response = await fetch(apiLink);
      const responseData = await response.json();
      let obj = responseData[0];
      let variants = obj.variants;
      variants.forEach(variant => {
        let variantUrl = 'https://www.asos.com/prd/' + variant.id ;
        const div = document.createElement('div');
        div.id = 'variant-url';
        div.innerText = variantUrl;
        
        document.body.appendChild(div);
        })
      console.log('Variant-ID',responseData);
    });
    return await context.extract(variants, { transform });
  }
  
} 
