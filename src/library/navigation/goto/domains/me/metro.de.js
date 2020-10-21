module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'metro.de',
        timeout: 50000,
        country: 'DE',
        store: 'metro',
        zipcode: '',
    },
    implementation: async({ url, zipcode, storeId },
        parameters, context, dependencies,
    ) => {
        await context.setCssEnabled(true);
        await context.setLoadImages(true);
        await context.setLoadAllResources(true);
        await context.goto(url);
        // await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
        // const clickMethod = await context.evaluate(async function() {
        //     const cookieSelector = document.querySelector("cms-cookie-disclaimer") && document.querySelector("cms-cookie-disclaimer").shadowRoot.querySelector("button.field-accept-button-name");
        //     // const cookieSelector = document.querySelector("cms-cookie-disclaimer")?.shadowRoot.querySelector("button.field-accept-button-name");
        //     if (cookieSelector) {
        //         console.log('Cookie selector found');
        //         cookieSelector.click();
        //         console.log('Cookie selector clicked');
        //         return true;
        //     } else {
        //         return false;
        //     }
        // })
        // const check = clickMethod();
        // if (check) {
        //     await context.waitForNavigation({ timeout: 30000 });
        // }
        //     const clickMethod = async() => {
        //         return await context.evaluate(async function() {
        //             const cookieSelector = document.querySelector("cms-cookie-disclaimer") && document.querySelector("cms-cookie-disclaimer").shadowRoot.querySelector("button.field-accept-button-name");
        //             if (cookieSelector) {
        //                 console.log('Cookie selector found');
        //                 cookieSelector.click();
        //                 console.log('Cookie selector clicked');
        //                 return true;
        //             } else {
        //                 return false;
        //             }
        //         })
        //     }
        //     const check = clickMethod();
        //     if (check) {
        //         await context.waitForNavigation({ timeout: 30000 });
        //     }
    }
};