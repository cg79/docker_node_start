var mongoQuery = require('../../../mongo/mongo');
const ObjectID = require("mongodb").ObjectID;

class GenericService {

  getCollection(name) {
    let db = mongoQuery.getDb();
    return db.collection(name);
  }
  
  async add(data, tokenObj, info) {
    if(!tokenObj) {
      throw  "no token";
    }

    const {collection, fields} = info;

    data.userId = tokenObj.id;
    data.added = new Date();

    // if (fields) {
    //   var fieldsUpdated = {};
    //   for (var i = 0; i < fields.length; i++) {
    //     const field = fields[i];
    //     fieldsUpdated[field] = data[field];
    //   }
    // }

    var db = await this.getCollection(collection).insert(data);
    return db;
  }


  async edit(data, tokenObj, info) {
    console.log(info);
    if (!tokenObj) {
      throw  "no token";
    }

    if (!data._id) {
      throw 'no id';
    }
    data.modified = new Date();
    const {collection, fields} = info;

    var findCriteria = {
      _id: ObjectID(data._id),
      userId: tokenObj.id
    };


    var setCriteria = {};
    if (fields) {
      var fieldsUpdated = {};
      for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        fieldsUpdated[field] = data[field];
      }
      setCriteria = {
        '$set': fieldsUpdated
      }
    } else {
      setCriteria = {
        '$set': data
      }
    }

    var db = await this.getCollection(collection).update(findCriteria, setCriteria, {
      upsert: true
    });

    return db;
  }

  async findById(data, tokenObj, info) {
    // data.userId = tokenObj.id;
    var filterCriteria = {
      _id: ObjectID(data._id)
    };

    const {collection, fields} = info;

    if (fields) {
      var fieldsUpdated = {};
      for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        filterCriteria[field] = data[field];
      }
    }
    console.log(filterCriteria);
    const doc = await this.getCollection(collection).findOne(filterCriteria);
    return doc;
  }

  async findOne(data, tokenObj, info) {
    // data.userId = tokenObj.id;
    var filterCriteria = {
      userId: tokenObj.id
    };
    if(data._id) {
      filterCriteria._id = ObjectID(data._id);
    }

    const {collection, fields} = info;

    for(var prop in data){
      if(prop === '_id') {
        filterCriteria._id = ObjectID(data._id);   
      }else{
        filterCriteria[prop] = data[prop];
      }
    }

    const sortCriteria = info.sort;
    if(sortCriteria) {
      const doc = await this.getCollection(collection).find(filterCriteria).sort(sortCriteria).toArray();
      return doc.length ?  doc[0] : null;
    } else {
      const doc = await this.getCollection(collection).findOne(filterCriteria);
      return doc;
    }
  }

  async findList(data, tokenObj, info) {
    // data.userId = tokenObj.id;
    const filterCriteria = data || {};

    filterCriteria.userId = tokenObj.id;

    const {collection, fields} = info;

    if (fields) {
      var fieldsUpdated = {};
      for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        filterCriteria[field] = data[field];
      }
    }

    const doc = await this.getCollection(collection).find(filterCriteria).toArray();
    return doc;
  }


  async removeOne(data, tokenObj, info) {
    if(data && data._id) {
      data._id =  ObjectID(data._id);
    }
    const filterCriteria = data || {};

    filterCriteria.userId = tokenObj.id;

    const {collection, fields} = info;

    if (fields) {
      var fieldsUpdated = {};
      for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        filterCriteria[field] = data[field];
      }
    }

    const doc = await this.getCollection(collection).deleteOne(filterCriteria);
    return doc;
  }

  async remove(data, tokenObj, info) {
      if(data && data._id) {
        data._id =  ObjectID(data._id);
      }
      const filterCriteria = data || {};

      filterCriteria.userId = tokenObj.id;

      const {collection, fields} = info;

      if (fields) {
        var fieldsUpdated = {};
        for (var i = 0; i < fields.length; i++) {
          const field = fields[i];
          filterCriteria[field] = data[field];
        }
      }

      const doc = await this.getCollection(collection).delete(filterCriteria);
      return doc;
  }

  async page(data, tokenObj, info) {
    const {collection, fields, pager} = info;

    console.log(info);
    const filterCriteria = data || {};
    var filter = this.getCollection(collection)
        .find(filterCriteria);


    pager.itemsOnPage = parseInt(pager.itemsOnPage);
      pager.pageNo--;
      filter = filter.limit(pager.itemsOnPage)
          .skip(pager.itemsOnPage * pager.pageNo);

      if(info.sort && info.sort.items) {
        const { items } = info.sort;
        const sortCritera = {};
        for(var i=0;i<items.length;i++)
        {
          const it  = items[i];
          for(var prop in it){
            sortCritera[prop] = it[prop];
          }  
        }
        

        filter = filter.sort(sortCritera);  
      }
      
    // filter = filter.toArray();
    const items = await filter.toArray();

    // console.log(questions);
    const count = await this.getCollection(collection).count(filterCriteria);
    return {
      items,
      count: count,
      pageNo: pager ? pager.pageNo + 1 : 0
    };
  }


}

module.exports = new GenericService();
