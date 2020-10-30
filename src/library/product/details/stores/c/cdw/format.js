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
            if (row.image) {
                row.image.forEach(item=>{
                    if(item.text.indexOf('https:')!=0)
                        item.text='https:' +item.text;
                })
            }
            if (row.alternateImages) {
                var tot=1;
                row.alternateImages.forEach(item => {
                    tot++;
                    item.text = 'https:' + item.text;
                });
                row.secondaryImageTotal=[{"text":tot,"xpath":row.alternateImages[0]['xpath']}];
            }
            if (row.reviewCount) {
                row.reviewCount.forEach(item => {
                    let reviewCountData = item.text.split(' ');
                    item.text = reviewCountData[0];
                });
            }
            if(row.description){
                var tmpArr=[];
                row.description.forEach(item=>{
                    tmpArr.push(item.text);
                });
                row.description=[{"text":"|| "+tmpArr.join(" || "),"xpath":row.description[0]['xpath']}];
            }
            if(row.descriptionBullets){
                var tmpArr=[];
                row.descriptionBullets.forEach(item=>{
                    tmpArr.push(item.text);
                });
                row.descriptionBullets=[{"text":tmpArr.length,"xpath":row.descriptionBullets[0]['xpath']}];
            }
            if(row.ratingCount){
                var tmpArr=[];
                row.ratingCount.forEach(item=>{
                    var tmp=item.text.replace('(','');
                    item.text=tmp.replace(')','');
                });
            }
            if(row.additionalDescBulletInfo){
                var tmpArr=[];
                row.additionalDescBulletInfo.forEach(item=>{
                    tmpArr.push(item.text);
                });
                row.additionalDescBulletInfo=[{"text":"|| "+tmpArr.join(" || "),"xpath":row.descriptionBullets[0]['xpath']}];
            }
            if(row.specifications){
                var tmpArr=[];
                row.specifications.forEach(item=>{
                    tmpArr.push(item.text);
                });
                row.specifications=[{"text":tmpArr.join(" || "),"xpath":row.specifications[0]['xpath']}];
            }
            if(row.shippingDimensions){
                var tmpArr=[];
                row.shippingDimensions.forEach(item=>{
                tmpArr.push(item.text);
                })
                row.shippingDimensions=[{"text":tmpArr.join(" X "),"xpath":row.shippingDimensions[0]['xpath']}];
            }
            if(row.featureBullets){
                var tmpArr=[];
                row.featureBullets.forEach(item=>{
                tmpArr.push(item.text);
                })
                row.featureBullets=[{"text":tmpArr.join(" | "),"xpath":row.featureBullets[0]['xpath']}];
            }
            if(row.customerServiceAvailability){
                var tmpArr=[];
                row.customerServiceAvailability.forEach(item=>{
                tmpArr.push(item.text);
                })
                if(tmpArr.length>0){
                    row.featureBullets=[{"text":"Yes"}];
                }else{
                    row.featureBullets=[{"text":"No"}];
                }
            }
            
            if(row.imageZoomFeaturePresent){
                row.imageZoomFeaturePresent=[{"text":"Yes"}];
            }else{
                row.imageZoomFeaturePresent=[{"text":"No"}];
            }
        }
    }
    return cleanUp(data);
};
module.exports = { transform };
