/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );

  for (const { group } of data) {
    for (const row of group) {
      try {
        var product;
        var regEx;
        var regexMatch;
        var productDetails;
        console.log('CodeTrade');
        console.log(row);

        // if (row.aggregateRating) {
        //   product = row.aggregateRating[0].raw;
        //   // regEx = /\(([^)]+)\)/;
        //   // regexMatch = regEx.exec(product);

        //   productDetails = JSON.parse(product);
        //   // console.log("productDetails coDE tRADE");
        //   // console.log(productDetails);
        //   row.aggregateRating = [
        //     { text: productDetails.aggregateRating.ratingValue },
        //   ];
        // }
        // if (row.ratingCount) {
        //   var product = row.ratingCount[0].text;
        //   // console.log(product);
        //   var processProduct= JSON.parse(product)
        //   console.log(processProduct.aggregateRating.ratingCount);
        //   row.ratingCount = [
        //     { text: processProduct.aggregateRating.ratingCount },
        //   ];

        //   //regEx = /\(([^)]+)\)/;
        //   //regexMatch = regEx.exec(product);

        //   productDetails = JSON.parse(product);
        //   console.log("productDetails coDE tRADE");
        //   console.log(productDetails);
        //   row.ratingCount = [
        //     { text: productDetails.ratingCount },
        //   ];  
        // }
        // if (row.availabilityText) {
        //   row.availabilityText = [
        //     {
        //       text:
        //         row.availabilityText[0].text === 'true'
        //           ? 'In Stock'
        //           : 'Out Of Stock',
        //     },
        //   ];
        // }
        // if (row.brandText) {
        //   product = row.brandText[0].text;
        //   //console.log(product);
        //   regEx = /\[{(.*)}]/;
        //   regexMatch = regEx.exec(product);
        //   console.log('product data');
        //   console.log(regexMatch);
        //   // productDetails = JSON.parse(regexMatch[1]);
        //   // row.brandText = [{ text: productDetails.transactionProducts.brand }];
        // }
        if(row.sku){
          var product = row.sku[0].text;
          regEx = /\{.*}/;
          regexMatch = regEx.exec(product);
          console.log('start');
          console.log(regexMatch[0]);
          console.log('end');
          var processProduct= JSON.parse(regexMatch[0])
          console.log(processProduct.transactionProducts[0].sku);
          row.sku = [

          { text: processProduct.transactionProducts[0].sku},
            
          ];
        }

        if(row.nameExtended){
          product=row.nameExtended[0].text;
          regEx = /\{.*}/;
          regexMatch = regEx.exec(product);
          console.log('start');
          console.log(regexMatch[0]);
          console.log('end');
          var processProduct=JSON.parse(regexMatch[0])
          console.log(processProduct.transactionProducts[0].name);
          if(
            processProduct.transactionProducts[0].name && processProduct.transactionProducts[0].brand){
            row.nameExtended = [
              {

                text: `${processProduct.transactionProducts[0].brand} ${processProduct.transactionProducts[0].name} ${processProduct.transactionProducts[0].size} ${processProduct.transactionProducts[0].colour}`,
              },
            ];
           } 
        }else if(processProduct.transactionProducts[0].name && processProduct.transactionProducts[0].brand && processProduct.transactionProducts[0].colour) {
           row.nameExtended = [
              {

                text: `${processProduct.transactionProducts[0].brand} ${processProduct.transactionProducts[0].name} ${processProduct.transactionProducts[0].colour} `,
              },
            ];
        }
        
        else if(processProduct.transactionProducts[0].name && processProduct.transactionProducts[0].brand && processProduct.transactionProducts[0].size && processProduct.transactionProducts[0].colour ){
          row.nameExtended = [
              {

                text: `${processProduct.transactionProducts[0].brand} ${processProduct.transactionProducts[0].name} ${processProduct.transactionProducts[0].size} ${processProduct.transactionProducts[0].colour}`,
              },
            ];
        }else{
          console.log(suceess);
        }
        


        

        

        
        
      } catch (exception) {
        console.log('Error in transform', exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
