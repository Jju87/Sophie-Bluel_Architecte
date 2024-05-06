const db = require('./../models');
const Categories = db.categories;

exports.findAll = async (req, res) =>  {
    try{
        const categories = await Categories.find();
        return res.status(200).json(categories);
    }catch(err){
        return res.status(500).json({ error: new Error('Something went wrong')})
    }
}

exports.create = async (req, res) => {
    try {
        const category = new Categories({
            name : req.body.name
        });
        await category.save();
        return res.status(201).json(category);
    } catch(err) {
        return res.status(500).json({ error: new Error('Something went wrong')});
    }
}