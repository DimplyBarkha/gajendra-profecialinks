const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const scroll = async function (context) {

    await context.evaluate(function () {

     /*  try { */
        let scrollTop = 0;
        let recordCount = 0;

        while (scrollTop !== 50000) {
          recordCount = keepScrolling(recordCount, 150);

          if (recordCount > 0) {
            
            scrollTop += 1000;
            window.parent.scroll(0, scrollTop);
            //window.scrollTo(0,document.body.scrollHeight);
            //window.scrollTo(0, scrollTop)
          }
          else break;
          console.log(scrollTop);
          if (scrollTop === 50000) {
            break;
          }
        }
        
        function keepScrolling(recordsCollected, maxRecords) {
          
          const recordSelector = 'div.col-mini-product';
          const recordsOnPage = document.querySelectorAll(recordSelector).length;

          console.log('rrrrr', recordsOnPage);
          //if (recordsOnPage == recordsCollected) return -1;
          if (recordsOnPage < maxRecords) return recordsOnPage;
          return -1;
        }
      /* } catch (e) {
        console.log('errrrrrrr', e);
      } */
    });
  };

  await scroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    transform,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation,
};

