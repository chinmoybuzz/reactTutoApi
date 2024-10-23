const { search, statusSearch } = require("../helper");
const Model = require("../models/user.model.js");
const { ObjectId } = require("mongoose").Types;
const errorHandler = require("../helper/errorHandler");
const {
  convertFieldsToAggregateObject,
} = require("../helper/index.js");

const PASSWORD_REGEX = /[a-z]/i;

 const  findAllData = async (params) => {
  try {
    params.searchValue =
      params.searchValue ||
      "fullname,fullname.firstName,fullname.lastName,email,platform,userDetails.address.city";
    params.selectValue =
      params.selectValue || "name email title roleId title status";

    const {
      keyword,
      limit = 10,
      offset = 0,
      status,
      searchValue,
      selectValue,
      sortQuery = "-createdAt",
      roleId,
      _id = "",
    } = params;
    const select = selectValue && selectValue.replaceAll(",", " ");
    const selectProjectParams = convertFieldsToAggregateObject(select, " ");
    // const userDetails = await Model.findOne({ _id: params.authUser._id });

    let query = { deletedAt: null };
    // let searchData = [];
    // if (_id) {
    //   query["_id"] = new ObjectId(_id);
    // }

    // const minBirthDate = new Date();
    // minBirthDate.setFullYear(minBirthDate.getFullYear() - minAge);

    // const maxBirthDate = new Date();
    // maxBirthDate.setFullYear(maxBirthDate.getFullYear() - maxAge);

    // if (minAge && maxAge) {
    //   searchData.push({
    //     $and: [
    //       { "userDetails.dateOfBirth": { $lte: minBirthDate } },
    //       { "userDetails.dateOfBirth": { $gte: maxBirthDate } },
    //       { "userDetails.dateOfBirth": { $ne: null } },
    //     ],
    //   });
    //   // query.$and = [
    //   //   { "userDetails.dateOfBirth": { $lte: minBirthDate } },
    //   //   { "userDetails.dateOfBirth": { $gte: maxBirthDate } },
    //   //   { "userDetails.dateOfBirth": { $ne: null } },
    //   // ];
    // }

    // if (city) {
    //   searchData.push({
    //     $and: [
    //       { "userDetails.address.city": { $eq: city } },
    //       { "userDetails.address.city": { $ne: null } },
    //     ],
    //   });
    //   // query.$and = [
    //   //   { "userDetails.address.city": { $eq: city } },
    //   //   { "userDetails.address.city": { $ne: null } },
    //   // ];
    // }

    // if (params.isSocialUserFor === "Dating") {
    //   searchData.push({
    //     $and: [
    //       { "userDetails.gender": { $ne: null } },
    //       { "userDetails.gender": { $ne: userDetails?.userDetails?.gender } },
    //     ],
    //   });
    // }
    // //if(userFavorite) query["userFavorite"] = new ObjectId(params.authUser._id)
    // if (params.favourite === "user") {
    //   searchData.push({
    //     $and: [
    //       { userFavorite: { $ne: null } },
    //       { userFavorite: { $eq: params.authUser._id } },
    //     ],
    //   });
    // }
    // if (params.favourite === "company") {
    //   searchData.push({
    //     $and: [
    //       { companyFavorite: { $ne: null } },
    //       { companyFavorite: { $eq: params.authUser._id } },
    //     ],
    //   });
    // }
    // if (gender) {
    //   searchData.push({
    //     $and: [
    //       { "userDetails.gender": { $ne: null } },
    //       { "userDetails.gender": { $eq: gender } },
    //     ],
    //   });
    // }
    // if (profile_type) {
    //   searchData.push({
    //     $and: [
    //       { "userDetails.profile_type": { $ne: null } },
    //       { "userDetails.profile_type": { $eq: profile_type } },
    //     ],
    //   });
    // }
    // if (searchData.length) {
    //   query.$and = searchData;
    // }

    if (status) query.status = statusSearch(status);

    //  if (isCompany == 1) query.companyDetails = { $ne: null };

    if (roleId) query.roleId = new ObjectId(roleId);
    if (keyword) {
      const searchQuery = searchValue
        ? searchValue.split(",")
        : select.split(" ");
      query.$or = search(searchQuery, keyword);
    }

    const myAggregate = Model.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "roles",
          foreignField: "_id",
          localField: "roleId",
          as: "roles",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$deletedAt", null] }],
                },
              },
            },
            { $project: { name: 1, code: 1 } },
          ],
        },
      },
      {
        $project: {
          roles: { $arrayElemAt: ["$roles", 0] },
          ...selectProjectParams,
        },
      },
    ]);
    const result = await Model.aggregatePaginate(myAggregate, {
      offset: offset,
      limit: limit,
      sort: sortQuery,
    });

    return { status: 200, message: "list fetch", ...result };
  } catch (error) {
    console.log(error);
    return errorHandler(error, params);
  }
};

const Add= async(params)=>{
  try {
        const newUser = await new Model({
      ...params,
      name: params.email.split("@")[0],
      email: params.email,
      password: createHashPassword(params.password),
    }).save();
  } catch (error) {
        console.log(error);
    return errorHandler(error, params);
  }

}
module.exports={
  findAllData
}