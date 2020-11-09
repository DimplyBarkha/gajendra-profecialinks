module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    transform: null,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    // checking if the extractor is on search results page and if true redirecting to the product page
    let productLink = 'https://www.bhphotovideo.com';
    const isExtractorOnSearchResultsPage = await context.evaluate(async () => {
      const currentUrl = window.location.href;
      return currentUrl.includes('search');
    });
    if (isExtractorOnSearchResultsPage) {
      const partialLink = await context.evaluate(async () => {
        return document.querySelector('div[class*="desc"] a[class*="title"]').getAttribute('href');
      });
      productLink += partialLink;
      context.goto(productLink);
    }
    await context.waitForNavigation();
    await context.waitForSelector('div[class*="details"]', { timeout: 3000 });

    await context.evaluate(async () => {
      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 15000) {
          await stall(1000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });

    await context.evaluate(async () => {
      const image360 = document.querySelector('button[data-selenium="inlineMediaOpenMedia inlineMedia3DGallery"]');
      const image360Present = image360 ? 'Yes' : 'No';
      document.querySelector('body').setAttribute('image360Present', image360Present);

      const ratingFullStars = document.querySelectorAll('div[class*=name] svg[class*="full"]').length;
      const ratingHalfStar = document.querySelector('div[class*=name] use[href*="Half"]') ? 0.5 : 0;
      const rating = String(ratingFullStars + ratingHalfStar);
      document.querySelector('body').setAttribute('rating', rating);
    });

    var dataRef = await context.extract(productDetails);
    const descriptions = dataRef[0].group[0].manufacturerDescription;
    if (descriptions) {
      descriptions.forEach((desc) => {
        descriptions[0].text += ' ' + desc.text;
      });
      descriptions.splice(1);
    }
    const customerServiceAvailability = dataRef[0].group[0].customerServiceAvailability;
    if (customerServiceAvailability && customerServiceAvailability[0].text !== 'No') {
      customerServiceAvailability[0].text = 'Yes';
    }
  },
};
