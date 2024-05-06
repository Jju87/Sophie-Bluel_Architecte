module.exports = mongoose => {
	const Users = mongoose.model(
	  "users",
	  new mongoose.Schema(
		{
		  email: { type: String, required: true, unique: true },
		  password: { type: String, required: true },
		},
		{ timestamps: false }
	  )
	);
  
	return Users;
  };