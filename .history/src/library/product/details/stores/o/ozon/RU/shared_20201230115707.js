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

    data.forEach(dataObj => {
        dataObj.group.forEach((fieldName, index) => {
            
            // _url
            const urlFieldValue = findKeyValue('url', data);
            fieldName['_url'] = urlFieldValue;
            
            // image
            if(fieldName.image){
                const imgObj = JSON.parse(fieldName.image[0].text);
                if(imgObj){
                    fieldName.image[0].text = imgObj.image;
                } else {
                    fieldName.image[0].text = '';
                }
            }

            // sku, variantId, _input, firstVariant
            if(fieldName.variantId){
                const idObj = JSON.parse(fieldName.variantId[0].text);
                if(idObj.sku){
                    const prodId = idObj.sku;
                    fieldName.variantId[0].text = prodId;
                    fieldName.input[0].text = prodId;
                    fieldName.firstVariant[0].text = prodId;
                } else {
                    fieldName.variantId[0].text = '';
                    fieldName.input[0].text = '';
                    fieldName.firstVariant[0].text = '';
                }
            }

            // _input
            const inputFieldValue = findKeyValue('input', data);
            fieldName['_input'] = inputFieldValue;

            //calciumPerServing
            if(fieldName.sodiumPerServing){
                const infoObj = JSON.parse(fieldName.sodiumPerServing[0].text);
                let str = infoObj.description.match(/натрий \S{1,},/);
                if(str){
                    str = str[0].replace(/натрий /, '');
                    fieldName.sodiumPerServing[0].text = str;
                } else {
                    fieldName.sodiumPerServing[0].text = '';
                }
            }

            // ratingCount
            if(fieldName.ratingCount){
                const infoObj = JSON.parse(fieldName.ratingCount[0].text);
                if(infoObj.aggregateRating) {
                    let str = infoObj.aggregateRating.reviewCount || '';
                    fieldName.ratingCount[0].text = str;
                } else {
                    fieldName.ratingCount[0].text = '';
                }
            }

            // aggregateRating
            if(fieldName.aggregateRating){
                const infoObj = JSON.parse(fieldName.aggregateRating[0].text);
                if(infoObj.aggregateRating){
                    let str = infoObj.aggregateRating.ratingValue || '';
                    fieldName.aggregateRating[0].text = str.replace(/./, ',');
                    console.log(str, 'RATING');
                } else {
                    fieldName.aggregateRating[0].text = '';
                }
            }
        });
    });
    return data;
};
module.exports = { transform };
  