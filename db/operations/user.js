import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";


const registerUser = async(knex,userData)=>{
    try {
        const {email, number, password} = userData
        const hashedPassword = await bcryptjs.hash(password, 10)
        const result = await knex("users").insert({
            email,
            number,
            password:hashedPassword
        })
        return result
    } catch (error) {
        console.error(error)
    }
    
}

const loginUser = async(knex,userData)=>{
    try {
        const {email, password} = userData
        const user = await knex("users").where({email}).first()
        const isValid = await bcryptjs.compare(password, user.password)
        if(!user || !isValid) {
            throw new Error("User not found")
        }else{
            const token = await jwt.sign(
                {id: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            )
            return {user, token}
        }
    } catch (error) {
        console.error(error)
    }
}

const addProductOnCard = async(knex, userId, productId, quantity)=>{
    try {
        const result = await knex("usersCard").insert({
            userId,
            productId,
            quantity
        })
        return result
    } catch (error) {
        console.error(error)
    }
}

const getProductsByUserId = async(knex, userId)=>{
    try {
        const result = await knex("usersCard")
            .where({userId})
            .select("productId", "quantity")
        return result
    } catch (error) {
        console.error(error)
    }
}

const joinTable = async(knex, userId)=>{
    try {
        const result = await knex('products')
            .join("usersCard", "products.id", "=", "usersCard.productId")
            .select("*")
            .where("usersCard.userId", "=", userId)
        return result
        
    } catch (error) {
        console.log(error);
    }
}

const getAllUsers = async(knex, userId)=>{
    try {
        const result = await knex("users").select("*")
        return result
    } catch (error) {
        console.error(error)
    }
}

export {registerUser, loginUser, addProductOnCard, getProductsByUserId, joinTable, getAllUsers}