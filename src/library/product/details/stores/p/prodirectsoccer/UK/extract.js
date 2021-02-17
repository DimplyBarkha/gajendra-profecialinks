const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'prodirectsoccer',
    transform,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const popup = await context.evaluate(async () => {
      return Boolean(document.querySelector('.taxfree-popup'));
    });
    if (popup) {
      await context.click('.taxfree-popup button');
    }

    await context.evaluate(async () => {
      try {
        const brand = JSON.parse(document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null)
        && document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
        &&  document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent
        && document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim()).brand;
        const imageAlt = document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null)
        && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
        && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent
        && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim();
        if(brand){
          document.querySelector('h1') ? document.querySelector('h1').setAttribute('brand',brand) : '';
        }
        if(imageAlt){
          document.querySelector('h1') ? document.querySelector('h1').setAttribute('image-alt',imageAlt) : '';
        }
      } catch (error) {
        console.log('Brand not found.')
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
