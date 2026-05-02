const Listning = require('../model/listning') //lsiting schema
const axios = require("axios"); //for map cordinate


//FOR SEARCH
module.exports.searchListning = async (req, res) => {
  let { q } = req.query;

  if (!q || q.trim() === "") {
    return res.json([]);
  }

  let listings = await Listning.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  }).limit(5); // sirf top 5 results

  res.json(listings);
};

module.exports.searchResult = async (req, res) => {
  let { q } = req.query;

  if (!q || q.trim() === "") {
    req.flash('error', "Please enter something to search");
    return res.redirect("/listning");
  }

  let listings = await Listning.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ] 
  });

  if (listings.length === 0) {
    req.flash("error", "No listings found for your search");
    return res.redirect("/listning");
  }

  res.render('listing/show.ejs', { alllist: listings });
};



//FOR LISTNING
module.exports.showAllListing = async (req, res) => {
  let alllist = await Listning.find();

  res.render('listing/show.ejs', { alllist })
};

module.exports.newListning = (req, res) => {

  res.render('listing/new.ejs');
};

module.exports.showAllList = async (req, res) => {
  let id = req.params.id;
  let listing = await Listning.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    }).populate('owner');
  // console.log(listing.reviews[0].author,'owner')
  if (!listing) {
    req.flash("error", "Listing Was Doe'not Exits!");
    return res.redirect(`/listning`);
  }

  // console.log(listing.geometry ,'geometry');


  return res.render('listing/view.ejs', { listing });
}

module.exports.createListning = async (req, res) => {

  const location = req.body.listning.location.trim();

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

  const response = await axios.get(url, {
    headers: { "User-Agent": "Wanderlust Project" }
  });

  const newlist = new Listning(req.body.listning);

  newlist.owner = req.user._id;
  newlist.image = req.file.path;

  // 1️⃣ fallback default (always safe)
  newlist.geometry = {
    type: "Point",
    coordinates: [73.1812, 22.3072] // fallback first
  };

  if (response.data.length > 0) {
    newlist.geometry = {
      type: "Point",
      coordinates: [
        Number(response.data[0].lon),
        Number(response.data[0].lat)
      ]
    };
  }

  //For debugging
  // console.log("API RESPONSE:", response.data);
  // console.log("LOCATION:", req.body.listning.location);
  // console.log("URL:", url);




  await newlist.save();

  req.flash("success", "Listing Was Created!");
  res.redirect("/listning");
}

module.exports.editpage = async (req, res) => {
  let id = req.params.id;
  let listing = await Listning.findById(id)
  if (!listing) {
    req.flash("error", "Listing Was Doe'not Exits!");
    return res.redirect(`/listning`);
  }
  res.render('listing/edit.ejs', { listing });
};

module.exports.editListning = async (req, res) => {
  let id = req.params.id;
  let listing = await Listning.findByIdAndUpdate(id, { ...req.body.listning });
  if (req.file) {
    listing.image = req.file.path;
    await listing.save()
  }
  // console.log(listing.image)
  req.flash("success", "Listing Was Updated!");
  res.redirect(`/listning/${id}`)
};

module.exports.destroyroute = async (req, res) => {
  let id = req.params.id;
  await Listning.findByIdAndDelete(id);

  req.flash("success", "Listing Was Delete!");
  res.redirect(`/listning`);
};