module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nume: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    prenume: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cnp: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true
    },
    varsta: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Persons',
    freezeTableName: true
  });

  Person.associate = (models) => {
    Person.belongsToMany(models.Car, { 
      through: 'Junction',
      as: 'cars',
      foreignKey: 'id_person'
    });
  };

  return Person;
}; 