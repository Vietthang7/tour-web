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
    unique: true, // Đảm bảo email là duy nhất  
  },  
  password: {  
    type: DataTypes.STRING(255), // Tăng kích thước để lưu trữ hash password  
    allowNull: false,  
  },  
  phone: {  
    type: DataTypes.STRING(15), // Thay đổi kích thước để phù hợp với số điện thoại quốc tế  
  },  
  token: {  
    type: DataTypes.STRING(255), // Tăng kích thước cho token  
    allowNull: false,  
  },  
  status: {  
    type: DataTypes.STRING(20),  
    allowNull: false,  
  },  
  role_id: {  
    type: DataTypes.INTEGER, // Sử dụng INTEGER cho khóa ngoại  
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
  createdBy: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },  
}, {  
  tableName: 'accounts',  
  timestamps: true, // Tự động quản lý createdAt và updatedAt  
});  


export default Account;

