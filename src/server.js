import express from "express";
import { Sequelize,DataTypes, where } from "sequelize";
const app = express();
app.use(express.json())

const db = new Sequelize({
    dialect:'postgres',
    host:'localhost',
    database:'data',
    username:'postgres',
    password:'sherzod',
    logging:false
});

const Products = db.define("products", {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    product_name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    product_price: {
        type:DataTypes.BIGINT,
        allowNull: false,
    }
},{
    deletedAt:true,
    freezeTableName:true
});

try {
    await db.authenticate();
    Products.sync({alter:true});

    app.post('/products', async (req,res) => {
        const {product_name,product_price} = req.body;
        const user = Products.build({
            product_name,
            product_price
        });
        await user.save(user)
        res.status(200).json({
            status:200,
            data:user
        })
    });
    app.get('/users', async (req,res) => {
        const users = await Products.findAll();
        res.status(200).json(users)
    })
    app.get('/users/:id', async (req,res) => {
        const findUser = await Products.findOne({where:{id:req.params.id}});
        res.status(200).json(findUser)
    })
    app.put('/users/:id', async (req,res) => {
        const {product_name,product_price} = req.body;
        // const user = await Products.findOne({where:{id:req.params.id}});
        // user.product_name = product_name;
        // user.product_price = product_price;
        // await user.save()
        const user = await Products.update({product_name:product_name,product_price:product_price},{
            where:{
                id:req.params.id
            }
        })

        res.status(200).json(user)
    })
    app.delete('/users/:id' , async (req,res) => {
        const deleteUser = Products.destroy({where:{id:req.params.id}});

        res.status(200).json(deleteUser);
    })
    console.log('succsess connection');
} catch (error) {
    console.log('error connection');
    db.close();
};

app.listen(4500 , () => console.log('server running on port: 4500'))