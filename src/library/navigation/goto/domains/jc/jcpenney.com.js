
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jcpenney.com',
    timeout: 5000000,
    country: 'US',
    store: 'jcpenney',
    zipcode: '',
  },
  // implementation: async ({ url }, {country, domain }, context, dependencies) => {
  //   await context.goto(url, { timeout: 70000, waitUntil: 'load', checkBlocked: true });
  //   const elem = await context.evaluate(function(){
  //   return Boolean(document.querySelector('body>h1'));
  //   });
  //   if(elem){
  //     return context.reportBlocked(404,'Blocked!');
  //   }
  // },
};