import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  information: {
    type: DataTypes.TEXT('long'),
  },
  permissions: {
    type: DataTypes.TEXT('long'),
  },
  createdBy: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Đặt giá trị mặc định là false
  },
}, {
  tableName: 'roles',
  timestamps: true, // Tự động quản lý createdAt và updatedAt
});

export default Role;
