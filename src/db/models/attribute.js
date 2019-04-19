module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define('Attribute', {
    attribute_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'attribute'
  });

  Attribute.associate = (models) => {
    Attribute.hasMany(models.AttributeValue, {
      foreignKey: 'attribute_id',
      onDelete: 'CASCADE'
    });
  };

  return Attribute;
};
