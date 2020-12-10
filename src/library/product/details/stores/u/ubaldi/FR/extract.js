const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    transform,
    domain: 'ubaldi.com',
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
    await new Promise((resolve, reject) => setTimeout(resolve, 40000));
    try {
      await context.evaluate(() => {
        document.querySelector('.fa-fiche-bloc.points-forts').scrollIntoView({ behavior: 'smooth' });
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 60000));
      await context.waitForSelector('.flix-feature-image img', { timeout: 60000 });
    } catch (e) {
      console.log(e.message);
    }
    try {
      await context.evaluate(() => {
        document.querySelector('.ficheProduit').scrollIntoView({ behavior: 'smooth' });
        scroll(0, 1000);
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 60000));
      await context.waitForSelector('.flix-feature-image img', { timeout: 60000 });
    } catch (e) {
      console.log(e.message);
    }
    try {
      await context.waitForSelector('#loadbeeIframeId');
      const iframeUrl = await context.evaluate(() => {
        return document.querySelector('#loadbeeIframeId').getAttribute('src');
      });
      const productUrl = await context.evaluate(() => {
        return document.querySelector('meta[property="og:url"]').getAttribute('content');
      });
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation();
      await context.waitForSelector('img');
      const imageUrl = await context.evaluate(() => {
        const images = document.evaluate('//div[contains(@class,"thumbnail")]/@data-magnify-url | //div[contains(@class,"a-plus-box-main")]/img/@src', document, null, XPathResult.ANY_TYPE, null);
        let thisImage = images.iterateNext();
        let imageUrl = '';
        while (thisImage) {
          imageUrl += thisImage.textContent + ' | ';
          thisImage = images.iterateNext();
        }
        return imageUrl;
      });
      const descriptionContent = await context.evaluate(() => {
        const description = document.evaluate('//div[@class="product-details"] | //div[contains(@class,"a-plus-box-main")]/div[@class="body"] | //div[@id="attributes"]//div[@class="attribute-group"]/div[@class="attribute"]', document, null, XPathResult.ANY_TYPE, null);
        let thisDescription = description.iterateNext();
        let descriptionContent = '';
        while (thisDescription) {
          descriptionContent += thisDescription.textContent + ' | ';
          thisDescription = description.iterateNext();
        }
        return descriptionContent;
      });
      await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.waitForNavigation();
      await context.waitForSelector('#image_grande');
      const enhancedContent = { img: imageUrl, desc: descriptionContent };
      await context.evaluate((enhancedContent) => {
        document.querySelector('body').setAttribute('images', enhancedContent.img);
        document.querySelector('body').setAttribute('description', enhancedContent.desc);
      }, enhancedContent);
    } catch (e) {
      console.log('Iframe not present', e.message);
    }
    return await context.extract(productDetails, { transform });
  },
};
