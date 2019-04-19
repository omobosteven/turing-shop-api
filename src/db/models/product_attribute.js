module.exports = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define('ProductAttribute', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attribute_value_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'product_attribute'
  });
  ProductAttribute.associate = (models) => {
    ProductAttribute.belongsTo(models.Product, {
      foreignKey: 'product_id'
    });
    ProductAttribute.belongsTo(models.AttributeValue, {
      foreignKey: 'attribute_value_id'
    });
  };

  return ProductAttribute;
};
