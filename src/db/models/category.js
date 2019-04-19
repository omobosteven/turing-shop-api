module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'category'
  });

  Category.associate = (models) => {
    Category.belongsTo(models.Department, {
      foreignKey: 'department_id'
    });

    Category.belongsToMany(models.Product,
      { through: 'ProductCategory', foreignKey: 'category_id' });
  };

  return Category;
};
