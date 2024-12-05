const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');  // For SQLite

const Workout = sequelize.define('Workout', {
    date: { type: DataTypes.DATE, allowNull: false },
    duration: { type: DataTypes.INTEGER },
    exercisesPerformed: { type: DataTypes.INTEGER },
    totalWeightLifted: { type: DataTypes.INTEGER },
    totalSets: { type: DataTypes.INTEGER },
    totalReps: { type: DataTypes.INTEGER }
});

sequelize.sync();

module.exports = Workout;
