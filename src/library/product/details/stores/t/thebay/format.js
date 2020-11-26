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
                let  varientId = [];
                row.variantId.forEach(item => {
                    variantId = item.text.split(":");
                });

                row.variantId = [{'text': variantId[1].trim(),'xpath':row.variantId[0].xpath}];
            }  

            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                  info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });
                if(tmp_desc != ''){
                info.push(tmp_desc);
                }
                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            } 

            if (row.ratingCount) {
                let rating_count = [];
                row.ratingCount.forEach(item => {
                  rating_count = item.text.split(" ");
                });

                row.ratingCount = [{'text':rating_count[0],'xpath':row.ratingCount[0].xpath}];
            }

            if (row.aggregateRating) {  
                let counter = 0;                 
                row.aggregateRating.forEach(item => {
                    if(item.text.trim() == "TTteaser__icon--full"){
                        counter = counter + 1;
                    }else if(item.text.trim() == "TTteaser__icon--half"){
                        counter = counter + 0.5;
                    }
                });
                row.aggregateRating = [{'text': counter.toFixed(1),'xpath': row.aggregateRating[0].xpath}]        
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
