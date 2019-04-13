module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 50
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 50
      }
    },
    credit_card: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    day_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    eve_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mob_phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });

  Customer.associate = (models) => {
    // associations can be defined here
  };

  return Customer;
};
