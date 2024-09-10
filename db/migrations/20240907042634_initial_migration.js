/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
    
    await knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable("users", function (table) {
                table.uuid("id").defaultTo(knex.raw("UUID()")).primary();
                table.string("email").notNullable().unique();
                table.string("number").notNullable().unique();
                table.string("password").notNullable();
            });
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
    await knex.schema.dropTableIfExists("users");
};