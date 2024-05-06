module.exports = (req, res, next) => {
    try{
        const host = req.get('host');
        const title = req.body.title.trim() ?? undefined;
        const categoryId = parseInt(req.body.category) ?? undefined;
        const imageUrl = req.body.imageUrl ?? undefined;
        console.log(title,categoryId,imageUrl)
        if(title !== undefined &&
            title.length > 0 &&
            categoryId !== undefined &&
            categoryId > 0 &&
            imageUrl !== undefined){
            req.work = {title, categoryId, imageUrl}
            next()
        }else{
            return res.status(400).json({error: new Error("Bad Request")})
        }
    }catch(e){
        return res.status(500).json({error: new Error("Something wrong occured")})
    }

}
