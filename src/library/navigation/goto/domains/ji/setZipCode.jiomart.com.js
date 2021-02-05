
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'IN',
    domain: 'jiomart.com',
    store: 'jiomart',
    zipcode: '560012',
  },
  implementation: async ({ url,zipcode }, parameters, context, dependencies) => {
    try{
      await new Promise(res=>setTimeout(res,3000))
      await context.click('li#pincode_section', { timeout:7000 });
      await context.waitForSelector('input.inp_text', { timeout: 7000 });
      await new Promise(res=>setTimeout(res,3000))
      await context.setInputValue('input.inp_text',zipcode);
      await new Promise(res=>setTimeout(res,3000))
      await context.clickAndWaitForNavigation('div.pin_detail button.apply_btn', { timeout: 7000, waitUntil:'networkidle0' });
      await new Promise(res=>setTimeout(res,3000))

    } catch(err){
      throw new Error(`Pincode change failed, ${err}`);
    }

  },
};
