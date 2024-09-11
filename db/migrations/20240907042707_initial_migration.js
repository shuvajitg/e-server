/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
    await knex.schema.hasTable('usersCard').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable("usersCard", function (table) {
                table.uuid("userId");
                table.foreign("userId").references("users.id");
                table.uuid("productId").notNullable();
                table.foreign("productId").references("products.id");
                table.integer("quantity").notNullable();
            });
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
    await knex.schema.dropTableIfExists("usersCard")
};