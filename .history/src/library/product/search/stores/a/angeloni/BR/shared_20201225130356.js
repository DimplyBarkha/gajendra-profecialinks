/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    const state = context.getState();
    let orgRankCounter = state.orgRankCounter || 0;
    let rankCounter = state.rankCounter || 0;
    const productCodes = state.productCodes || [];
    for (const { group } of data) {
        for (const row of group) {
        rankCounter += 1;
        if (!row.sponsored) {
            orgRankCounter += 1;
            row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
        }));
        }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });


    function findKeyValue(key, data){
        let result = [];
        data.forEach(dataObj=> {
            dataObj.group.forEach(dataObjElem => {
                if(dataObjElem[key]){
                    result = dataObjElem[key];
                }
            });
        });
        return result;
    } 

    function cleanText (str) {
        return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
    }

    // const mainUrl = 'https://www.ozon.ru';

    data.forEach(dataObj => {
        dataObj.group.forEach((fieldName, index) => {
            // // name
            // if(fieldName.name){
            //     fieldName.name[0].text = cleanText(fieldName.name[0].text);
            // }

            // // reviewCount
            // if(fieldName.reviewCount){
            //     let reviewCountText = fieldName.reviewCount[0].text;
            //     reviewCountText = reviewCountText.replace(/\D/g, '');
            //     fieldName.reviewCount[0].text = reviewCountText;
            // }

            // // productUrl
            // if(fieldName.productUrl) {
            //     let productUrl = fieldName.productUrl[0].text;
            //     fieldName.productUrl[0].text = mainUrl + productUrl;
            // }

            // // aggregateRating
            // if(fieldName.aggregateRating) {
            //     let aggregateRatingValue = fieldName.aggregateRating[0].raw;
            //     let fixedNumber = Number(aggregateRatingValue).toFixed(1);
            //     fieldName.aggregateRating[0].text = `${fixedNumber}`;
            //     fieldName.aggregateRating[0].value = +fixedNumber;
            // }

            // id
            if(fieldName.id){
                let idText = fieldName.id[0].text;
                console.log(idText);
                let firstMatch = idText.match(/-\d{0,}\z/g);
                console.log(firstMatch);
                // if(firstMatch){
                //     fieldName.id[0].text = firstMatch[0].replace(/\D/g, '');
                // } else {
                //     fieldName.id[0].text = '';
                // }
            }

        });
    });

return data;
};
module.exports = { transform };