module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
    }
  }, {
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'review'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });

    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return Review;
};
