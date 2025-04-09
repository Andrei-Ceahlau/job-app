module.exports = (sequelize, DataTypes) => {
  const Junction = sequelize.define('Junction', {
    id_person: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Persons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    id_car: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cars',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: true,
    tableName: 'Junctions',
    freezeTableName: true
  });

  return Junction;
}; 