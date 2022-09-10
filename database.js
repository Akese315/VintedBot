const Sequelize = require('sequelize');
var ProductTable = require('./ProductTable.js')

class Database
{
    sequelize;
    ProductTable;

    constructor()
    {

    }


    __init__()
    {
        this.sequelize = new Sequelize({
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            // SQLite only
            storage: 'database.sqlite',
        });

        this.sequelize.authenticate();
        return this.defineTable();
    }

    defineTable()
    {         
        this.ProductTable = ProductTable.init(this.sequelize);
        return this.ProductTable.sync()       
    }

    async deleteAllProduct()
    {
        await this.ProductTable.destroy({
            where:{}
           
          });
    }

    findPurchased()
    {
        return this.ProductTable.findAll({where:{
            isBougth:true
        },
        order: [
            ['BougthAt', 'DESC']
        ],})
    }

    async addProduct(productUrl)
    {
        await this.ProductTable.create({url: productUrl})
    }

    async urlExists(productUrl)
    {   
        return this.ProductTable.findOne({where:{url:productUrl}});
    }

}

/*
var db = new Database();
db.__init__().then(async ()=>
{
    console.log(await db.urlExists("ezqd"))
    console.log(await db.urlExists("https://www.vinted.fr/hommes/vetements/hauts-and-tee-shirts/chemises/chemises-a-rayures/2080547770-camicia-a-maniche-corte"));
    
   //await db.deleteAllProduct();
});

*/
module.exports = Database;


