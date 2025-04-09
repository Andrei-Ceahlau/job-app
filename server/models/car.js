module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marca: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    an_fabricatie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacitate_cilindrica: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taxa_impozit: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Cars',
    freezeTableName: true
  });

  Car.associate = (models) => {
    Car.belongsToMany(models.Person, { 
      through: 'Junction',
      as: 'persons',
      foreignKey: 'id_car'
    });
  };

  return Car;
}; 