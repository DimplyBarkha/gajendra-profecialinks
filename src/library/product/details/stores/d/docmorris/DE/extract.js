
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    transform: null,
    domain: 'docmorris.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let fulldescription = '';
      let getMarketingDetails = document.querySelector('div.product-marketingText-wrap');
      let data = [];
      let getData = document.querySelectorAll('ul.usps li');
      for (i = 0; i < getData.length; i++) {
        data.push(getData[i].innerText);
      }
      let descriptionBulltes = data.join('||');
      let tabularDescription = document.querySelector('table.product-detail-table');
      fulldescription = fulldescription + descriptionBulltes;
      if (tabularDescription)
        fulldescription = fulldescription + tabularDescription.innerText;;
      if (getMarketingDetails)
        fulldescription = fulldescription + getMarketingDetails.innerText;
      document.head.setAttribute('fulldescriptions', fulldescription)
      let description = document.querySelector('body').getAttribute('fulldescription');
      console.log(description)
      if (document.querySelector('li.tab2'))
        document.querySelector('li.tab2').click();
      await new Promise(resolve => setTimeout(resolve, 5000));
      let directions = ''
      let getDirections = document.querySelector('div[data-headline*="Gebrauchsinformationen"]')
      if (getDirections) {
        if (document.querySelector('div[data-headline*="Gebrauchsinformationen"] h2'))
          document.querySelector('div[data-headline*="Gebrauchsinformationen"] h2').click()
        await new Promise(resolve => setTimeout(resolve, 5000));
        directions = document.querySelector('div[data-headline*="Gebrauchsinformationen"] div.open-content').innerText
        document.head.setAttribute('directions', directions)
      }
      if (document.querySelector('li.tab1'))
        document.querySelector('li.tab1').click();
      await new Promise(resolve => setTimeout(resolve, 5000));

    });
    await context.extract(productDetails);
  },
};
