module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    department_id: {
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
      allowNull: true
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'department'
  });

  Department.associate = (models) => {
    Department.hasMany(models.Category, {
      foreignKey: 'department_id',
      onDelete: 'CASCADE'
    });
  };

  return Department;
};
