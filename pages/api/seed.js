import User from "../../models/User";
import Product from "../../models/Product";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = async (req, res) => {
    await db.connect();
    // await User.deleteMany();
    // await User.insertMany(data.products);
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await db.disconnect();
    res.send({ message: 'success'});
};

export default handler;