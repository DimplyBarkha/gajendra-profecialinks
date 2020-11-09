
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    openSearchDefinition: {
      pageOffset: 1,
      template: 'https://api-cloud.aboutyou.de/v1/products?with=attributes%3Akey%28brand%7CbrandLogo%7Cname%7CquantityPerPack%7CplusSize%7CcolorDetail%7CsponsorBadge%7CsponsoredType%7Cpremium%7CmaternityNursing%7Cexclusive%7Cgenderage%7CspecialSizesProduct%7CmaterialStyle%7CsustainabilityIcons%7CassortmentType%29%2CadvancedAttributes%3Akey%28materialCompositionTextile%7Csiblings%29%2Cvariants%2Cvariants.attributes%3Akey%28shopSize%7CcategoryShopFilterSizes%7Ccup%7Ccupsize%7CvendorSize%7Clength%7Cdimension3%7CsizeType%7Csort%29%2Cimages.attributes%3Alegacy%28false%29%3Akey%28imageNextDetailLevel%7CimageBackground%7CimageFocus%7CimageGender%7CimageType%7CimageView%29%2CpriceRange&filters%5Bcategory%5D=20201&filters%5Bterm%5D={searchTerms}&filters%5BsecondHand%5D=false&sortDir=desc&sortScore=category_scores&sortChannel=web_default_ab1&page={page}&perPage=20&shopId=605#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'aboutyou.de',
    zipcode: '',
  },
};
