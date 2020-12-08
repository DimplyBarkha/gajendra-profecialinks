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


  async function scrollToRec (node) {
    await context.evaluate(async function (node) {
      var element = (document.querySelector(node)) ? document.querySelector(node) : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 7000);
        });
      }
    }, node);
  }
  await scrollToRec('div.product-breadcrumb-carousel__container');
  await scrollToRec('jl-recommendations-panel');
  
    await context.evaluate(async function () {
      console.log(document.querySelector('jl-recommendations-panel'))
      console.log(document.querySelector('jl-recommendations-panel').recommendationGroups)
      const recommendations = document.querySelector('jl-recommendations-panel') ? document.querySelector('jl-recommendations-panel').recommendationGroups : null;
      if (recommendations && recommendations.length) {
        console.log(recommendations)
        const products = recommendations[0].recommendedProducts;
        products.forEach(element => {
          addHiddenDiv('ii_recommended_products', element.title);
        });
      }
      // try {
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
      // } catch (error) {
      //   console.log(error);
      // }
      // async function infiniteScroll () {
      //   let prevScroll = document.documentElement.scrollTop;
      //   while (true) {
      //     window.scrollBy(0, document.documentElement.clientHeight);
      //     await new Promise(resolve => setTimeout(resolve, 1000));
      //     const currentScroll = document.documentElement.scrollTop;
      //     if (currentScroll === prevScroll) {
      //       break;
      //     }
      //     prevScroll = currentScroll;
      //   }
      // }
      // await infiniteScroll();
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
