const { cleanUp } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        transform: cleanUp,
        domain: 'ubaldi.com',
        zipcode: '',
    },
    implementation: async({ inputstr }, { transform }, context, { productDetails }) => {
        try {
            await context.click('body.full-background.search-hidden.msgpromo-t1:nth-child(2) div.contenu_page div.fiche-article.classic.standard:nth-child(3) div.clearfix:nth-child(3) div.fa-listes-pack-et-classic div.ficheProduit div.fa-article-infos-bottom.clearfix > div.fa-fiche-bloc.caracteristiques.carac-detaillees:nth-child(3)');
            await context.waitForSelector('body.full-background.search-hidden.msgpromo-t1:nth-child(2) div.contenu_page div.fiche-article.classic.standard:nth-child(3) div.clearfix:nth-child(3) div.fa-listes-pack-et-classic div.ficheProduit div.fa-article-infos-bottom.clearfix > div.fa-fiche-bloc.caracteristiques.carac-detaillees:nth-child(3)>div');
        } catch (e) {
            console.error(e);
        } finally {
            await context.extract(productDetails, { transform });
        }
    },
};