import * as bookshelf from 'bookshelf'
import {Model} from './model'

export class Collection<T extends Model<any>> extends bookshelf.Collection<T>
{
}
