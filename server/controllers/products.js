const getProducts = async (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "This route will show all the products in the data basse",
    });
};

module.exports = { getProducts };
