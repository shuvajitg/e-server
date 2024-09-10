/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export const up = async function(knex) {
    await knex.schema.hasTable('products').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable("products", function (table) {
                table.uuid("id").defaultTo(knex.raw("UUID()")).primary();
                table.string("title").notNullable();
                table.string("description").notNullable();
                table.float("price").notNullable();
                table.float("demoPrice").notNullable();
                table.integer("stock").notNullable();
                table.string("category").notNullable();
                table.json("size");
                table.string("brand").notNullable();
                table.json("imageUrl");
                table.timestamps(true, true);
            });
        }
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
    await knex.schema.dropTableIfExists("products");
};
