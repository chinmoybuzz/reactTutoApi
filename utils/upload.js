const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mime = require("mime");
// const { Parser } = require("json2csv");

// const csv = require("csv-parser");

const generateRandomString = async (length) => {
  return crypto.randomBytes(length).toString("hex");
};

const uploadBinaryFile = async (params) => {
  const fileName = params.file.name || new Date().getTime();
  const extension = mime.getExtension(params.file.mimetype);
  const randomString = await generateRandomString(12);
  const uniqueFileName = `${fileName}${randomString}.${extension}`;

  !fs.existsSync(path.join(__dirname, `../public/storage/${params.folder}`)) &&
    fs.mkdirSync(path.join(__dirname, `../public/storage/${params.folder}`));

  fs.writeFileSync(
    path.join(
      __dirname,
      `../public/storage/${params.folder}/${uniqueFileName}`
    ),
    params.file.buffer
  );

  return {
    name: uniqueFileName,
    path: `storage/${params.folder}/${uniqueFileName}`,
    size: params.file.size,
    extension,
  };
};

const deleteFile = (filePath) => {
  fs.existsSync(path.join(__dirname, `../public/${filePath}`)) &&
    fs.unlinkSync(path.join(__dirname, `../public/${filePath}`));
};

// const uploadCSV = async (params) => {
//   try {
//     !fs.existsSync(
//       path.join(__dirname, `../public/storage/${params.folder}`)
//     ) &&
//       fs.mkdirSync(path.join(__dirname, `../public/storage/${params.folder}`));
//     const filePath = path.join(
//       __dirname,
//       `../public/storage/${params.folder}/${params.file}`
//     );
//     // Parse CSV content from params.csvContent
//     const userData = [];
//     const parser = csv();
//     parser.write(params.csvContent);
//     parser.end();
//     await new Promise((resolve, reject) => {
//       parser
//         .on("data", (data) => userData.push(data))
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     // Convert parsed data back to CSV format
//     const json2csvParser = new Parser(params.fields);
//     const logData = json2csvParser.parse(userData);

//     // Write CSV data to file
//     await fs.promises.writeFile(filePath, logData, "utf-8");

//     // Read CSV data from the file for verification
//     const dataArray = [];
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .pipe(csv())
//         .on("data", (data) => {
//           dataArray.push(data);
//         })
//         .on("end", resolve)
//         .on("error", reject);
//     });
//     return dataArray;
//   } catch (error) {
//     throw new Error("There is a problem: " + error.message);
//   }
// };
module.exports = { uploadBinaryFile, deleteFile };
