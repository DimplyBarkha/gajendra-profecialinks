async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  // await context.waitForSelector('form.age-gate-form');  
  // await new Promise(r => setTimeout(r, 1000000));
  await context.evaluate(async () =>{
    
    const firstItem = document.querySelector('select#age-gate-m > option[value = "01"]');
    firstItem.click();
    const firstItem1 = document.querySelector('select#age-gate-d > option[value = "01]');
    firstItem1.click();
    const firstItem2 = document.querySelector('select#age-gate-y > option[value = "1984"]');
    firstItem2.click();
    const firstItem3 = document.querySelector('input.age-gate-submit');
    firstItem3.click();
    await new Promise(r => setTimeout(r, 1000000));
  });

  // await context.waitForSelector('select#age-gate-m > option[value = "01"]');
  // await context.click('select#age-gate-m > option[value = "01"]');

  // await context.waitForSelector('select#age-gate-d > option[value = "01"]');
  // await context.click('select#age-gate-d > option[value = "01"]');

  // await context.waitForSelector('select#age-gate-y > option[value = "1984"]');
  // await context.click('select#age-gate-y > option[value = "1984"]');

  // await context.waitForSelector('input.age-gate-submit');
  // await context.click('input.age-gate-submit');

  // await context.waitForSelector('li.reviews_tab');
  // await context.click('li.reviews_tab > a');
  
  return await context.extract(productReviews);
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    transform: null,
    domain: 'hazesmokeshop.ca',
    zipcode: '',
  },
  implementation,
};
