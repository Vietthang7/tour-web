import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const RoleAccount = sequelize.define("RoleAccount", {
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles', // Tên bảng mà khóa ngoại tham chiếu đến
      key: 'id', // Tên trường trong bảng mà khóa ngoại tham chiếu đến
    }
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'accounts', // Tên bảng mà khóa ngoại tham chiếu đến
      key: 'id', // Tên trường trong bảng mà khóa ngoại tham chiếu đến
    }
  }
}, {
  tableName: 'accounts_roles',
  timestamps: false,
});

export default RoleAccount;