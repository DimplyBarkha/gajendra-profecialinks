const { transform } = require('../format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div[class*="inpage_selector_InTheBox"] img', { timeout: 10000 });
    await new Promise((resolve, reject) => setTimeout(resolve, 90000));
    console.log('selector of inTheBox exist');
  } catch (e) {
    console.log("selector of inTheBox doesn't exist");
  }
  try {
    await context.waitForSelector('div[class="content"]>h3', { timeout: 10000 });
    await new Promise((resolve, reject) => setTimeout(resolve, 90000));
    console.log('selector of updp exist');
  } catch (e) {
    console.log("selector of updp doesn't exist");
  }
  try {
    await context.waitForSelector('button[class="btn-expand btn-reset"]', { timeout: 10000 });
    await new Promise((resolve, reject) => setTimeout(resolve, 90000));
    console.log('selector of enhancedContent button exist');
  } catch (e) {
    console.log("selector of enhancedContent button doesn't exist");
  }


  await context.evaluate(async () => {
    window.scroll(0, 1000);
    if (document.querySelector('li#brand_navigation_item a')) {
      // @ts-ignore
      document.querySelector('li#brand_navigation_item a').click();
      if (document.querySelector('button.btn-expand.btn-reset img[src]')) {
        // @ts-ignore
        document.querySelector('button.btn-expand.btn-reset img[src]').click();
        await new Promise(resolve => setTimeout(resolve, 500));
        let scrollTop = 0;
        let lastscrollvalue = 0;
        while (scrollTop !== 7000) {
          await stall(750);
          lastscrollvalue = scrollTop;
          scrollTop += 1000;
          window.scroll(lastscrollvalue, scrollTop);
          if (scrollTop === 7000) {
            await stall(500);
            break;
          }
        }
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    document.querySelector('#flix_product_video') && document.querySelector('#flix_product_video').dispatchEvent(new Event('click'));
    await new Promise(resolve => setTimeout(resolve, 500));

    const allMeta = document.querySelectorAll('meta');
    let ean = '';
    let brand = '';
    if (allMeta) {
      for (let i = 0; i < allMeta.length; i++) {
        if (allMeta[i].hasAttribute('itemprop')) {
          if (allMeta[i].getAttribute('itemprop') === 'gtin13') {
            ean = allMeta[i].getAttribute('content');
          }
          if (allMeta[i].getAttribute('itemprop') === 'brand') {
            brand = allMeta[i].getAttribute('content');
          }
        }
      }
      console.log('-----EAN-----', ean);
      console.log('-----BRAND-----', brand);
    }

    if (!document.querySelector('#wc-aplus,#inpage_container')) {
      if (ean && brand) {
        const catElement1 = document.createElement('script');
        catElement1.async = true;
        catElement1.type = 'text/javascript';
        catElement1.src = `https://media.flixcar.com/delivery/js/inpage/2754/fr/ean/${ean}?&=2754&=fr&ean=${ean}&brand=${brand}&ssl=1&ext=.js`;
        catElement1.crossOrigin = 'true';
        document.body.appendChild(catElement1);
      }
    }
     try{
      const id = document.evaluate('//meta[@itemprop="sku"]/@content',document).iterateNext() && document.evaluate('//meta[@itemprop="sku"]/@content',document).iterateNext().textContent;
      let res = await fetch(`https://api.early-birds.fr/widget/multi/581c930912983dbb01366c48-581ca05312983dbb01366c4c/recommendations/dff0a092-a05b-4b56-b5f2-9d44263d72c1?variables={"$productId":${id}}`)
      let data = await res.json()
      let props = Object.getOwnPropertyNames(data)
      const text = ''
      const updp = []
      props.forEach(prop => {
        let prods = data[prop].recommendations
        prods.forEach(prod => {
          updp.push(prod.product.descriptifCourt)
        })
      })
      let updp2 = [...new Set(updp)]
      updp2.forEach((element,index)=>{
          let updpDiv = document.createElement('div');
          updpDiv.className = 'updpinformation';
          updpDiv.innerText = updp2[index];
          document.body.append(updpDiv);
      })

     }catch(e) {
       console.log(e)
     }

  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation,
};
