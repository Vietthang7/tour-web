import Account from "../models/account.model";
import Tour from "../models/tour.model";
import Category from "../models/category.model";
import Order from "../models/order.model";

export const paginationAccounts = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 5
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countAcounts = await Account.count({
        where:find,
    });
    const totalPage = Math.ceil(countAcounts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
export const paginationTours = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 10
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countTours = await Tour.count({
        where:find,
    });
    const totalPage = Math.ceil(countTours / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
export const paginationCategories = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 10
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countCategories = await Category.count({
        where:find,
    });
    const totalPage = Math.ceil(countCategories / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
export const paginationOrders = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 20
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countOrders = await Order.count({
        where:find,
    });
    const totalPage = Math.ceil(countOrders / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}







