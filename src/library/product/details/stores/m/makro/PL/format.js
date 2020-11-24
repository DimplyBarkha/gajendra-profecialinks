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
      if(row.ingredientsList){
        let inf=[];
        row.ingredientsList.forEach(item=>{
          inf.push(item.text);
        })
        row.ingredientsList=[{"text":inf.join(',')}];
      }
      if(row.caloriesPerServing){
        let inf=[];
        row.caloriesPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.caloriesPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.caloriesFromFatPerServing=[{"text":inf[1]}];
        }
      }
      if(row.totalFatPerServing){
        let inf=[];
        row.totalFatPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.totalFatPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.totalFatPerServingUom=[{"text":inf[1]}];
        }else{
          row.totalFatPerServingUom=[{"text":"g"}];
        }
      }
      if(row.saturatedFatPerServing){
        let inf=[];
        row.saturatedFatPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.saturatedFatPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.saturatedFatPerServingUom=[{"text":inf[1]}];
        }else{
          row.saturatedFatPerServingUom=[{"text":"g"}];
        }
      }
      if(row.totalCarbPerServing){
        let inf=[];
        row.totalCarbPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.totalCarbPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.totalCarbPerServingUom=[{"text":inf[1]}];
        }else{
          row.totalCarbPerServingUom=[{"text":"g"}];
        }
      }
      if(row.dietaryFibrePerServing){
        let inf=[];
        row.dietaryFibrePerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.dietaryFibrePerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.dietaryFibrePerServingUom=[{"text":inf[1]}];
        }else{
          row.dietaryFibrePerServingUom=[{"text":"g"}];
        }
      }
      if(row.totalSugarsPerServing){
        let inf=[];
        row.totalSugarsPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.totalSugarsPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.totalSugarsPerServingUom=[{"text":inf[1]}];
        }else{
          row.totalSugarsPerServingUom=[{"text":"g"}];
        }
      }
      if(row.proteinPerServing){
        let inf=[];
        row.proteinPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.proteinPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.proteinPerServingUom=[{"text":inf[1]}];
        }else{
          row.proteinPerServingUom=[{"text":"g"}];
        }
      }
      if(row.saltPerServing){
        let inf=[];
        row.saltPerServing.forEach(item=>{
          inf=item.text.split(' ');
        });
        row.saltPerServing=[{"text":inf[0]}];
        if(inf.length>1){
          row.saltPerServingUom=[{"text":inf[1]}];
        }else{
          row.saltPerServingUom=[{"text":"g"}];
        }
      }
      if(row.technicalInformationPdfPresent){
        row.technicalInformationPdfPresent=[{"text":"Yes"}];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };