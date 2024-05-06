const db = require('./../models');
const Works = db.works;

exports.findAll = async (req, res) =>  {
    try{
        const works = await Works.find().populate('category');
        return res.status(200).json(works);
    }catch(err){
        return res.status(500).json({ error: new Error('Something went wrong')})
    }
}

exports.create = async (req, res) => {
    console.log('Start create function');
    const title = req.body.title;
    const category = req.body.category;
    const imageUrl = req.body.imageUrl;
    console.log(`Title: ${title}, Category: ${category}, ImageUrl: ${imageUrl}`);
    try{
        console.log('Creating new work');
        const work = new Works({
            title,
            imageUrl,
            category,
        });
        console.log('Saving work');
        await work.save();
        console.log('Work saved successfully');
        return res.status(201).json(work)
    }catch (err) {
        console.log('Error occurred:', err);
        return res.status(500).json({ error: new Error('Something went wrong') })
    }
}

exports.delete = async (req, res) => {
    console.log('Start delete function')
    try{
        console.log('Deleting work');
        const work = await Works.findById(req.params.id);
        if (!work) {
            return res.status(404).json({message: 'Work Not Found'});
        }
        await work.deleteOne();
        console.log('Work deleted successfully');
        return res.status(204).json({message: 'Work Deleted Successfully'})
    }catch(e){
        console.log('Error occurred:', e);
        return res.status(500).json({error: new Error('Something went wrong')})
    }
}