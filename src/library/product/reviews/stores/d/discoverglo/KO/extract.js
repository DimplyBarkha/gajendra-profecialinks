
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    transform: null,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      if(document.querySelector('div#Cookie')){
        document.querySelector('button#ok_col').click();
      }
      if(document.querySelector('div.btns button.btnf-yes')){
        document.querySelector('div.btns button.btnf-yes').click();
      }
      if(document.querySelector('input#juminsag')){
        document.getElementById("juminsag").value = "19840101";
        if(document.querySelector('button#entrance')){
          document.querySelector('button#entrance').click();
        }
      }
      if(document.querySelector('li#showTab2')){
        document.querySelector('li#showTab2 a').click();
      }
    });
    const { productReviews } = dependencies;
    return await context.extract(productReviews);
  },
};
