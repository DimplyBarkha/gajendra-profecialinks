
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    transform: null,
    domain: 'vapordna.com',
    zipcode: "''",
  },
implementation: async (inputs,
  parameters,
  context,
  dependencies) => {
  const { productReviews } = dependencies;

  await context.evaluate(async () => {
    function addHiddenDiv (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.className = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if(document.getElementById('prompt-background')){
      console.log("bgggg=>>>");
      
      document.getElementById('submit_birthdate').click();
    }

    if (document.querySelector('.product-single__meta')) {
        var url = window.location.href;
        var brand = null;
        brand = url.match(/Logic|Juul|juul|logic/);
      addHiddenDiv('vapordna_brand', brand);
    }
  });

  return await context.extract(productReviews);
},
};