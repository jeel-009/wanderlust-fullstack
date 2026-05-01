const User = require('../model/user.js')  //user schema

const passport = require('passport');


module.exports.singuppageloading =  (req, res) => {
    res.render('./users/user.ejs');
}

module.exports.singup = async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        let data = new User({ username, email });
        let result = await User.register(data, password);
        req.login(result, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcom To Wanderlust");
           return res.redirect('/listning');
        });
    }
    catch (e) {
        req.flash("error", e.message);
       return res.redirect('/signup')
    }
};

module.exports.loginpageloading = (req, res) => {
    res.render('./users/login.ejs')
}

module.exports.login =  (req,res,next)=>{
    const redirectUrl = req.session.redirectUrl || '/listning';

    passport.authenticate('local',{
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,()=>{
        req.flash('success','Welcome Back To Wanderlust');

        delete req.session.redirectUrl;
     return   res.redirect(redirectUrl);
    });
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Your Are LogOut!');
      return  res.redirect('/listning')

    })
}