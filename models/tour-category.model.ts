import { DataTypes, Model } from "sequelize";  
import sequelize from "../config/database";  

export interface ITourCategory {  
  tour_id: number;  
  category_id: number;  
}  

class TourCategory extends Model<ITourCategory> implements ITourCategory {  
  public tour_id!: number;  
  public category_id!: number;  
}  

TourCategory.init({  
  tour_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,  
    primaryKey: true,  
    references: {  
      model: 'tours', // Tên bảng mà khóa ngoại tham chiếu đến  
      key: 'id', // Tên trường trong bảng mà khóa ngoại tham chiếu đến  
    }  
  },  
  category_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,  
    primaryKey: true,  
    references: {  
      model: 'categories', // Tên bảng mà khóa ngoại tham chiếu đến  
      key: 'id', // Tên trường trong bảng mà khóa ngoại tham chiếu đến  
    }  
  }  
}, {  
  tableName: 'tours_categories',  
  timestamps: false,  
  sequelize, // passing the `sequelize` instance is required  
});  

export default TourCategory;