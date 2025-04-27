import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { salesType } from "./salesType";
import { heroSection } from "./heroSectionType";
import { ourCollection } from "./ourCollectionType";
import { productImageType } from "./productImageType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    orderType,
    salesType,
    heroSection,
    ourCollection,
    productImageType,
  ],
};
