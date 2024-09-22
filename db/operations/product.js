

const addProduct = async (knex, productData) => {
  try {
    const {
      title,
      description,
      price,
      demoPrice,
      stock,
      category,
      size,
      brand,
      imageUrl,
    } = productData;
    const result = await knex("products").insert({
      title,
      description,
      price,
      demoPrice,
      stock,
      category,
      size: JSON.stringify(size),
      brand,
      imageUrl: JSON.stringify(imageUrl),
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getAllProduct = async (knex, productData) => {
  try {
    const result = await knex("products").select("*");
    return result;
  } catch (error) {
    console.log(error);
  }
}

const deleteProductById = async (knex, productId) => {
  try {
    const result = await knex("products").where({ id: productId }).del();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export {addProduct, getAllProduct,deleteProductById};
