import Account from "../models/account.model";
import Tour from "../models/tour.model";
import Category from "../models/category.model";
import Order from "../models/order.model";
import sequelize from "../config/database";
import { QueryTypes } from "sequelize";

// Định nghĩa kiểu cho kết quả đếm  
interface CountResult {
    count: number;
}
export const paginationAccounts = async (req, find: any) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };

    // Lấy số trang từ query params  
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }

    const countQuery = `SELECT COUNT(*) as count FROM accounts WHERE deleted = false ${req.query.status ? `AND status = ?` : ''} ${req.query.keyword ? `AND fullName LIKE ?` : ''}`;  
    const replacements = [];  
    if (req.query.status) replacements.push(req.query.status);  
    if (req.query.keyword) replacements.push(`%${req.query.keyword}%`);  

    const [countResult] = await sequelize.query<CountResult>(countQuery, {  
        replacements,  
        type: QueryTypes.SELECT  
    });  

    const countProducts = countResult.count;  
    pagination["totalPage"] = Math.ceil(countProducts / pagination.limitItems);  

    return pagination;
}
// export const paginationSongs = async (req, find) => {
//     const pagination = {
//         currentPage: 1,
//         limitItems: 4
//     };
//     if (req.query.page) {
//         pagination.currentPage = parseInt(req.query.page);
//     }
//     pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

//     const countProductCategory = await Song.countDocuments(find);
//     const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
//     pagination["totalPage"] = totalPage;
//     return pagination;
// }
// // Singers
// export const paginationSingers = async (req, find) => {
//     const pagination = {
//         currentPage: 1,
//         limitItems: 4
//     };
//     if (req.query.page) {
//         pagination.currentPage = parseInt(req.query.page);
//     }
//     pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

//     const countProductCategory = await Singer.countDocuments(find);
//     const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
//     pagination["totalPage"] = totalPage;
//     return pagination;
// }
// //Accounts
// export const paginationAccount = async (req, find) => {
//     const pagination = {
//         currentPage: 1,
//         limitItems: 4
//     };
//     if (req.query.page) {
//         pagination.currentPage = parseInt(req.query.page);
//     }
//     pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

//     const countAcounts = await Account.countDocuments(find);
//     const totalPage = Math.ceil(countAcounts / pagination.limitItems);
//     pagination["totalPage"] = totalPage;
//     return pagination;
// }

// //User
// export const paginationUser = async (req, find) => {
//     const pagination = {
//         currentPage: 1,
//         limitItems: 4
//     };
//     if (req.query.page) {
//         pagination.currentPage = parseInt(req.query.page);
//     }
//     pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

//     const countPosts = await User.countDocuments(find);
//     const totalPage = Math.ceil(countPosts / pagination.limitItems);
//     pagination["totalPage"] = totalPage;
//     return pagination;
// }
// // End User



