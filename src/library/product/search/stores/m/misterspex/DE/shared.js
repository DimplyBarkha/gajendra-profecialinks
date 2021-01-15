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

    const inputFieldValue = findKeyValue('input', data);
    const urlFieldValue = findKeyValue('url', data);

    data.forEach(dataObj => {
        dataObj.group.forEach((fieldName, index) => {
            // _input
            fieldName['_input'] = inputFieldValue;
            if(fieldName['_input']){
                let inputText = fieldName['_input'][0].text;
                if(inputText.match(/SearchTerm=\w{0,}/g) && inputText.match(/SearchTerm=.{0,}/g)[0]) {
                    inputText = inputText.match(/SearchTerm=.{0,}/g)[0]
                        .replace(/\%20/g, ' ')
                        .replace(/SearchTerm=/g, '');
                    fieldName['_input'][0].text = inputText;
                }
            }
            // _url
            fieldName['_url'] = urlFieldValue;

            if(fieldName.name){
                fieldName.name[0].text = cleanText(fieldName.name[0].text);
            }

            if(fieldName.thumbnail){
                fieldName.thumbnail[0].text = `https:${fieldName.thumbnail[0].text}`
            }
        });
    });

    return data;
};
module.exports = { transform };
  