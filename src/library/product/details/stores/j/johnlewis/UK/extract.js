const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try{
      await context.waitForSelector('button[data-test="allow-all"]');
      await context.click('button[data-test="allow-all"]');
    }catch(e){
      console.log('No cookies box')
    }
    try{
      await context.waitForSelector('section[data-test="product-card"] img');
      await context.click('h2[class*=title_title]');
      let a = await context.evaluate(()=>{
        return (document.querySelector('section[data-test="product-card"] a').getAttribute('href'));
      });
      console.log(a);
      await context.waitForNavigation();
      await context.waitForSelector('.product-page img')
    }catch(err){
      console.log('No result found')
    }
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (document.querySelector('div.product-detail__description-inner')) {
        let desc = document.querySelector('div.product-detail__description-inner').innerHTML;
        desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').trim();
        addHiddenDiv('desc', desc);
      }

      if (document.querySelector('a.product-detail__brand-link')) {
        //@ts-ignore
        const brandLink = document.querySelector('a.product-detail__brand-link').href;
        addHiddenDiv('brandLink', brandLink);
      }
      //@ts-ignore
      const response = document.querySelector('script') ? JSON.parse(document.querySelector("script[type='application/ld+json']").innerText) : null;
      if (response) {
        try{
          const brandText = response.brand.name;
          addHiddenDiv('brandText', brandText);
        }catch(e){
          console.log('Brand name not present')
        }
        try{
          const mpc = response.mpn;
          addHiddenDiv('mpc', mpc);
        }catch(e){
          console.log('mpc not present')
        }
        try{
          const image = response.image;
          addHiddenDiv('image', image);
        }catch(e){
          console.log('image not present')
        }
        try{
          const sku = response.sku;
          addHiddenDiv('sku', sku);
        }catch(e){
          console.log('sku not present')
        }
        try{
          const productId = 'p' + response.productId;
          addHiddenDiv('productId', productId);
        }catch(e){
          console.log('mpc not present')
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
