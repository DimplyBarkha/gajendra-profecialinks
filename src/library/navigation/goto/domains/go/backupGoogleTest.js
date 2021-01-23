
module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'google.com',
        timeout: null,
        zipcode: '',
        country: 'US',
        store: 'google',
    },
    implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
        await context.goto(url, { first_request_timeout: 30000, timeout: 20000 })
            // , antiCaptchaOptions: { type: "RECAPTCHA" }
            // .then(()=>{
            //   console.log(context)
            //   throw new Error('stop')
            // })

            // hits captcha page, gets redirected to something like: 
            // 'https://www.google.com/sorry/index?continue=https://www.google.com/search%3Fq%3DDiemme%2520Monfumo%2520Boot%2520in%2520Dark%2520Green%2520Suede%2520%257C%2520FWRD&q=EgSl42iwGMWEq4AGIhkA8aeDS8fHPIOtShU7vJzVHgeF4OfoNocJMgFy'
            // and context is destroyed/not working after..


            .catch(async (err) => {
                let captchaTypeText = err.data.captchaType;
                console.log(`Recaptcha hit? ${captchaTypeText}`);
                if (captchaTypeText == 'RECAPTCHA') {
                    // await context.evaluate(()=>{
                    //   window.location.reload();
                    // })

                    // let test = await context.evaluate(()=>{
                    //   let iframe = document.querySelector('div[id*=iframe]');
                    //   return !!iframe;
                    //   return iframe[0].contentDocument.body.querySelector('div#recaptcha').getAttribute('class');
                    // })
                    // console.log(`Iframe found:${test}`)

                    // console.log('Hit recaptcha, attempting to solve..');
                    // await context.solveCaptcha({ type:"RECAPTCHA", inputElement: 'div#rc-anchor-container'})
                    // console.log('Solved!');
                }

            });

        console.log(context)

    },
};
