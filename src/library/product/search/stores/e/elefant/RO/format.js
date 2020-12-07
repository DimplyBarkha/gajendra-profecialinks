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

    let p_count = 1;

    for (const { group } of data) {
        for (let row of group) {          
            if(row.rankOrganic && row.rank) {
                row.rankOrganic = [{'text':p_count}];
                row.rank = [{'text':p_count}];
                p_count = p_count + 1;
            }    
            if(row.ratingCount) {
                row.ratingCount.forEach(item => {                    
                    item.text = item.text.replace('.','');
                });
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
            
            if(row.aggregateRating) {
                 let count = 0;
                row.aggregateRating.forEach(item => {     
                    if(item.text.includes('rating-one')){
                        count = 1;
                    }   
                    if(item.text.includes('rating-two')){
                        count = 2;
                    } 
                    if(item.text.includes('rating-three')){
                        count = 3;
                    } 
                    if(item.text.includes('rating-four')){
                        count = 4;
                    } 
                    if(item.text.includes('rating-five')){
                        count = 5;
                    }  
                });
                row.aggregateRating = [{'text':count,'xpath':row.aggregateRating[0].xpath}];
            }   
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };