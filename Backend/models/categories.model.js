
module.exports = mongoose => {
	const Categories = mongoose.model(
	  "categories",
	  new mongoose.Schema(
		{
		  name: { type: String, required: true, unique: true },
		},
		{ timestamps: false }
	  )
	);
  
	return Categories;
  };