/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    for (const { group } of data) {
      
      for (const row of group) {  
        try {
            if (row.variantId) {
            
              var siteURL = '';
              var artNo = '';
              
              if(typeof row.productUrl[0].text !== "undefined")
              {
                siteURL = row.productUrl[0].text;
              }

              if(typeof row.sku[0].text !== "undefined")
              {
                if(row.sku[0].text.indexOf('Art.-Nr.:') != -1){
                  artNo = row.sku[0].text.replace("Art.-Nr.: ", "");
                } 
              }  
              row.variantId.forEach(item => {

                if(siteURL!='' && artNo!=''){
                  item.text = siteURL+'#sku='+artNo+'-'+item.text;
                }else{
                  item.text = '';
                }
              });

             }

             if (row.variantUrl) {
            
              var siteURL = '';
              var artNo = '';
              
              if(typeof row.productUrl[0].text !== "undefined")
              {
                siteURL = row.productUrl[0].text;
              }

              if(typeof row.sku[0].text !== "undefined")
              {
                if(row.sku[0].text.indexOf('Art.-Nr.:') != -1){
                  artNo = row.sku[0].text.replace("Art.-Nr.: ", "");
                } 
              }  
              row.variantUrl.forEach(item => {

                if(siteURL!='' && artNo!=''){
                  item.text = siteURL+'#sku='+artNo+'-'+item.text;
                }else{
                  item.text = '';
                }
              });
              
             }

             if (row.sku) {
              let newText = "";
              row.sku.forEach(item => {
                newText = item.text.replace("Art.-Nr.: ", "")
              });
              row.sku = [{ text: newText }];
             }
        } catch (exception) { console.log('Error in transform', exception); }
  
      }
    }
    return data;
  };
  
  module.exports = { transform };