import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // Tên database
  process.env.DATABASE_USERNAME, // username
  process.env.DATABASE_PASSWORD, // password
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false
  }
);
sequelize.authenticate().then(() => {
   console.log('Kết nối Database thành công.');
}).catch((error) => {
   console.error('Kết nối Database thất bại: ', error);
});
export default sequelize;