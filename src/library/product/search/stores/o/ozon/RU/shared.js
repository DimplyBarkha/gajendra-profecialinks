/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

    const mainUrl = 'https://www.ozon.ru';
    const inputFieldValue = findKeyValue('input', data);
    const urlFieldValue = findKeyValue('url', data);

    data.forEach(dataObj => {
        dataObj.group.forEach((fieldName, index) => {

            // _input
            fieldName['_input'] = inputFieldValue;
            
            // _url
            fieldName['_url'] = urlFieldValue;

            // id
            if(fieldName.id){
                let idText = fieldName.id[0].text;
                if(idText.match(/.+\/([0-9]+).+/) && idText.match(/.+\/([0-9]+).+/)[1]){
                    idText = idText.match(/.+\/([0-9]+).+/)[1];
                    fieldName.id[0].text = idText;
                } else{
                    fieldName.id[0].text = '';
                }
            }

            // reviewCount
            if(fieldName.reviewCount){
                let reviewCountText = fieldName.reviewCount[0].text;
                reviewCountText = reviewCountText.replace(/\D/g, '');
                fieldName.reviewCount[0].text = reviewCountText;
            }

            // productUrl
            if(fieldName.productUrl) {
                let productUrl = fieldName.productUrl[0].text;
                fieldName.productUrl[0].text = mainUrl + productUrl;
            }

            // aggregateRating
            if(fieldName.aggregateRating) {
                let aggregateRatingValue = fieldName.aggregateRating[0].raw;
                let fixedNumber = Number(aggregateRatingValue).toFixed(1);
                fieldName.aggregateRating[0].text = `${fixedNumber}`;
                fieldName.aggregateRating[0].value = +fixedNumber;
            }
        });
    });

    return data;
};
module.exports = { transform };
  