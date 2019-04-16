module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    image: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    image_2: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    display: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'product'
  });

  Product.associate = (models) => {
    // associations can be defined here
  };

  return Product;
};
