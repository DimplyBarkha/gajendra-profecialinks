
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
    for (const row of group) {
      if(row.directions){
        row.directions.forEach(item=>{
          let tmp=JSON.parse(item.text);
          let tmp1=tmp.props.initialState.product.data.descriptionAttributeSets[0].descriptionAttributes;
          //console.log('tmp: ',tmp.props.initialState.product.data.descriptionAttributeSets[0].descriptionAttributes);
          for(let key in tmp1){
            //console.log('key:',key);
            //console.log('key:',key);
            let keyVal=tmp1[key];
            //console.log('keyVal:',keyVal);
            if(keyVal.name=='Przechowywanie'){
              row.storage=keyVal.value;
            }
            if(keyVal.name=='Przygotowanie i stosowanie'){
              row.directions=keyVal.value;
            }
            if(keyVal.name="Składniki"){
              row.ingredientsList=keyVal.value;
            }
          }
        })
      }
      if(row.caloriesPerServing){
        row.caloriesPerServing=[{"text":"kal"}];
      }
      if(row.totalFatPerServing){
        row.totalFatPerServingUom=[{"text":"g"}];
      }
      if(row.saturatedFatPerServing){
        row.saturatedFatPerServingUom=[{"text":"g"}];
      }
      if(row.totalCarbPerServing){
        row.totalCarbPerServingUom=[{"text":"g"}];
      }
      if(row.dietaryFibrePerServing){
        row.dietaryFibrePerServingUom=[{"text":"g"}];
      }
      if(row.totalSugarsPerServing){
        row.totalSugarsPerServingUom=[{"text":"g"}];
      }
      if(row.proteinPerServing){
        row.proteinPerServingUom=[{"text":"g"}];
      }
      if(row.saltPerServing){
        row.saltPerServingUom=[{"text":"g"}];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
