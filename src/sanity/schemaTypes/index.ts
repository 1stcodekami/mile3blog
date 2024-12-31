import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import comment from './comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType,comment,postType, authorType],
}
