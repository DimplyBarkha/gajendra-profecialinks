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

    for (const { group } of data) {
        for (let row of group) {           
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });

                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            }

            if (row.aggregateRating) {
                let rating = '';
                row.aggregateRating.forEach(item => {
                    rating = item.text.substring(0,3); 
                });
                if(rating){
                    rating = rating.replace(',','.');
                }

                row.aggregateRating = [{'text': rating,'xpath':row.aggregateRating[0].xpath}];
            }

            if (row.price) {
                let priceText = '';
                row.price.forEach(item => {
                    priceText = item.text; 
                });
                if(priceText){
                    priceText = priceText.replace(',','.');
                }

                row.price = [{'text': priceText,'xpath':row.price[0].xpath}];
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };