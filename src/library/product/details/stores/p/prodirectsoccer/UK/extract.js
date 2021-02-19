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
  implementation: async function implementation(
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
        function getElementsByXPath(xpath, parent) {
          const results = [];
          const query = document.evaluate(xpath, parent || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
            results.push(node);
          }
          return results.filter(e => e);
        }
        const variants = getElementsByXPath("(//div[contains(@class, 'product-filters js-product-filters')])[1][count(//div[contains(@class, 'select-size')])>0]//div[contains(@class, 'tabs__panels-item--active')]/div[contains(@class, 'product-sizes-list')]/button//span[contains(@class, 'product-sizes-list__value')]/../../button/@data-variant-id").join(' | ');
       if(variants) {
          document.querySelector('h1') ? document.querySelector('h1').setAttribute('variants', variants) : '';
       }
      } catch (error) {
        console.log('Element not appended')
      }
    });
    await context.evaluate(async () => {
      try {
        const brand = JSON.parse(document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null) &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext() &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim()) && JSON.parse(document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null) &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext() &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent &&
        document.evaluate("//script[@type='application/ld+json'][contains(.,'brand')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim()).brand;
        const imageAlt = document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null)
          && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
          && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent
          && document.evaluate("(//div[contains(@class,'grid-image-gallery__box')]//img/@alt)[1] | (//div[contains(@class,'circular-carousel')]//div[contains(@class,'product-thumb__box')]/img/@alt)[1]", document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.trim();
        if (brand) {
          document.querySelector('h1') ? document.querySelector('h1').setAttribute('brand', brand) : '';
        }
        if (imageAlt) {
          document.querySelector('h1') ? document.querySelector('h1').setAttribute('image-alt', imageAlt) : '';
        }
      } catch (error) {
        console.log('Brand not found.')
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
