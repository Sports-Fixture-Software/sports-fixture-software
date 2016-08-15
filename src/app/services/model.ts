import * as bookshelf from 'bookshelf'  

export class Model<T extends Model<any>> extends bookshelf.Model<T>
{
}
