
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  	const nextLink = await context.waitForSelector('a.link--next_page', { timeout: 7000 })
      .catch(() => console.log('On last page'));
    console.log(nextLink);	
	 if (nextLink) {
	 	console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
	    context.goto(nextLink[href], { timeout: 20000, waitUntil: 'load' });
	  }

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KO',
    store: 'auction',
    transform: null,
    domain: 'auction.co.kr',
    zipcode: '',
  },

};
