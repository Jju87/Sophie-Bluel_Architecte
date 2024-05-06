
module.exports = mongoose => {
	const Works = mongoose.model(
	  "works",
	  new mongoose.Schema(
		{
		  title: { type: String, required: true },
		  imageUrl: { type: String, required: true },
		  category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
		},
		{ timestamps: false }
	  )
	);
  
	return Works;
  };