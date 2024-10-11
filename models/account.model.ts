import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Account = sequelize.define("Account", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(10),
  },
  token: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Đặt giá trị mặc định là false
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'accounts',
  timestamps: true, // Tự động quản lý createdAt và updatedAt
});

export default Account;