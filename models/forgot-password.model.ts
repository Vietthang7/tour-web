import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  otp: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  expireAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'forgotpassword',
  timestamps: true, // Tự động quản lý createdAt và updatedAt
});

export default ForgotPassword;