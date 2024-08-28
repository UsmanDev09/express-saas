const { Model, DataTypes,Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`);
const User = require('./userModel'); 

class UsersToFriends extends Model {}

UsersToFriends.init({
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  friend_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  initiator_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'UsersToFriends',
  tableName: 'users_friends',
  timestamps: false,
});

// UsersToFriends.belongsTo(User, {
//   foreignKey: 'user_id',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// UsersToFriends.belongsTo(User, {
//   foreignKey: 'friend_id',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// UsersToFriends.belongsTo(User, {
//   foreignKey: 'initiator_id',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

module.exports = UsersToFriends;
