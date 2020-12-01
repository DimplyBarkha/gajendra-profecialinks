/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
        data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
        }))));
        return data;
    };    


    let tmp_desc = '';
    for (const { group } of data) {
        for (let row of group) { 

            if (row.variantId) {
                let productId = [];
                let formattedString = ''
                row.variantId.forEach(item => {                    
                    formattedString =  /[^/]*$/.exec(item.text)[0];
                    productId = formattedString.split(".");
                    productId[0] = productId[0].slice(0, -1);

                });
                row.variantId = [{'text': productId[0],'xpath':row.variantId[0].xpath}]; 
            }

            if (row.sku) {
                let productId = [];
                let formattedString = ''
                row.sku.forEach(item => {                    
                    formattedString =  /[^/]*$/.exec(item.text)[0];
                    productId = formattedString.split(".");
                    productId[0] = productId[0].slice(0, -1);

                });
                row.sku = [{'text': productId[0],'xpath':row.sku[0].xpath}]; 
            }
            
            if (row.descriptionBullets) {
                let info = [];
                row.descriptionBullets.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                row.descriptionBullets = [{'text':info.join(' | '),'xpath':row.descriptionBullets[0].xpath}];
            }

        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };