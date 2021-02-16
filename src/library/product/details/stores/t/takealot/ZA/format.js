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
    var rank = 1, quantityStr='',weightNetStr='',colorStr='',warrantyStr='',materialsStr='';
    for (let row of group) { 
      if(row.ingredientsList){
        row.ingredientsList.forEach(item=>{
          item.text=item.text.replace('Ingredients :','').trim();
          item.text=item.text.replace('Ingredients:','').trim();
          item.text=item.text.replace('Ingredients','').trim();
        })
      }
      if(row.quantity){
        row.quantity.forEach(item=>{
          if(item.text.indexOf('- Size:')=='0'){
            quantityStr=item.text.replace('- Size:','').trim();
          }
        })
        row.quantity=[{"text":quantityStr}];
      }
      if(row.weightNet){
        row.weightNet.forEach(item=>{
          if(item.text.indexOf('- Weight:')=='0'){
            weightNetStr=item.text.replace('- Weight:','').trim();
          }
        })
        row.weightNet=[{"text":weightNetStr}];
        delete row.tmpWeightNet;
      }else{
        let tmpWeightNet='';
        if(row.tmpWeightNet){
          row.tmpWeightNet.forEach(item=>{
            tmpWeightNet=item.text;
          })
          row.weightNet=[{"text":tmpWeightNet}];
          delete row.tmpWeightNet;
        }
      }
      if(row.color){
        row.color.forEach(item=>{
          if(item.text.indexOf('- Colour:')=='0'){
            colorStr=item.text.replace('- Colour:','').trim();
          }
        })
        row.color=[{"text":colorStr}];
      }
      if(row.warranty){
        row.warranty.forEach(item=>{
          if(item.text.indexOf('- Warranty:')=='0'){
            warrantyStr=item.text.replace('- Warranty:','').trim();
          }
        })
        row.warranty=[{"text":warrantyStr}];
        delete row.tmpWarranty;
      }else{
        let tmpWarranty='';
        if(row.tmpWarranty){
          row.tmpWarranty.forEach(item=>{
            tmpWarranty=item.text;
          })
          row.warranty=[{"text":tmpWarranty}];
          delete row.tmpWarranty;
        }
      }
      if(row.materials){
        row.materials.forEach(item=>{
          if(item.text.indexOf('- Material:')=='0'){
            materialsStr=item.text.replace('- Material:','').trim();
          }
        })
        row.materials=[{"text":materialsStr}];
      }
      
      if(row.ratingCount){
        row.ratingCount.forEach(item=>{
          let tmp=item.text.split(' ');
          item.text=tmp[0];
        })
      }
      
      if(row.description){
        let totBul=0;
        row.description.forEach(item=>{
          totBul+=item.text.match(/(\n+\s*)+-/g)?item.text.match(/(\n+\s*)+-/g).length:0;
        })
        row.descriptionBullets=[{"text":totBul}];
      }
      if(row.alternateImages){
        row.alternateImages.forEach(item=>{
          item.text=item.text.replace('-pdpxl.','-zoom.');
        })
      }
      /*if(row.descriptionBullets){
        let inf=[];
        row.descriptionBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.descriptionBullets=[{"text":inf.join(' | ')}];
      }*/
      if(row.variantId){
        row.variantId.forEach(item=>{
          let tmp=item.text.split('/reviews/')[0]
          let tmpAr=tmp.split('/');
          item.text=tmpAr.pop();
        })
      }
      if(row.additionalDescBulletInfo){
        let inf=[];
        row.additionalDescBulletInfo.forEach(item=>{
          inf.push(item.text);
        })
        row.additionalDescBulletInfo=[{"text":inf.join(' || ')}];
      }
      if(row.ingredientsList){
        let tmp=[],tmpVal='';
        row.ingredientsList.forEach(item=>{
          tmp.push(item.text);
        })
        row.ingredientsList=[{"text":tmp.join(' ').replace('Ingredients:','').replace('Ingredients :','').trim()}];
        if(row.ingredientsListOld){
          delete row.ingredientsListOld;
        }
      }else{
        let ingredientsListData='';
        if(row.ingredientsListOld){
          row.ingredientsListOld.forEach(item=>{
            console.log('item.text::',item.text);
            let tmp=item.text.match(/Ingredients\s*:\s*\n*(.+?)\n*$/is);
            console.log('tmp::',tmp);
            if(tmp){
              ingredientsListData=tmp[1];
            }
          })
          delete row.ingredientsListOld;
        }
        console.log('ingredientsListData ::',ingredientsListData);
        if(ingredientsListData!=''){
          row.ingredientsList=[{"text":ingredientsListData}];
        }
      }

      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return cleanUp(data);
};
module.exports = { transform };