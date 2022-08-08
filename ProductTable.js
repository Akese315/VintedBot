const { DataTypes, Model } = require("sequelize");

class ProductTable extends Model
{
    static init(sequelize)
    {
        return super.init(
            {
                urlID :
                {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                url: 
                {
                    type: DataTypes.STRING
                },
                isBougth:
                {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                BougthAt:
                {
                    type: DataTypes.DATE,
                    defaultValue: null,
                    allowNull: true
                }
            },
            {
                tableName: "ProductTable",  
                timestamps: true,
                sequelize
            });
    }
}

module.exports = ProductTable;