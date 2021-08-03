const date = require('date-and-time')
const user = require('../models/user.model');

function uuidv4() {
    return 'xxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
function fixdate(dt){
    return date.format((new Date(dt)),'YYYY-MM-DD');
} 

const Routes = (app) => {
    // alluser
    app.get('/', async (req, res) => {
        var perPage = 10;
        var page = parseInt(req.query.page, 10) || 0;
		await user.find({},(err, data)=> {
            if (!data) {
                res.status(500).json({ error: 'Internal Server Error'});
            }
            else{
                //console.log(data);
                res.render('home',{
                data: data.map(
                    data => data.toJSON()
                    ),
                    page : page, 
                    alert : req.query.alert 
                });
            }
        }).sort({start:-1})
        .limit(perPage)
        .skip(page);
    });

    //edit user    
    app.get('/edituser/:id', async (req, res) => {
		await user.find({_id : req.params.id },(err, data)=> {
            if (!data) {
				res.status(500).json({error: 'Internal Server Error'});
            }
            res.render('edit-user',{
                data: data.map(
                    data => data.toJSON()
                ), 
                alert : req.query.alert 
            });
        });
    });
    // Update User
   app.post('/edituser/:id', async (req, res) => {
		await user.findByIdAndUpdate({_id : req.params.id },{
            name: req.body.name,
            mail: req.body.mail,
            pass: req.body.pass,
            start: req.body.start,
            end: req.body.end,
            count: req.body.count}, {new: true},(err, data)=> {
                if (!data) {
                    res.status(404).send({
                        message: "Error -> Can NOT update a customer with id = " + req.params.id,
                        error: err
                    });
                }
                else{
                    res.redirect('/edituser/'+ req.params.id +'?alert=done');
                }
            });
        }); 
    // add user form
    app.get('/adduser', async (req, res) => {
		res.render('add-user');
    });
    //add user fuction
    app.post('/adduser', async (req, res) => {
		const userData= new user({
            _id: uuidv4(),
            name: req.body.name,
            mail: req.body.mail,
            pass: req.body.pass,
            start: fixdate(req.body.start),
            end: req.body.end,
            count: req.body.count,
            status: 1
        });
        userData.save(function (err, result) {
            if(!result){
                res.status(400).send({
                    message: "Can NOT add user",
                    error: err
                });
            }
            else{
                res.status(200).json(result);
            }
        });
    }); 
    //del user function
    app.get('/del/:id', async (req, res) => {
		await user.findByIdAndRemove(req.params.id,(err, data)=> {
            if (!data) {
                res.status(404).json({
                  message: "Does Not exist a Customer with id",
                  error: "404",
                });              
            }
            else{
            res.redirect('/?alert='+req.params.id +' User deleted successfully.');}
        });
    });
     
   //Find User by Search
    app.post('/', async (req, res) => {
        await user.find({name: { $regex : req.body.name} },(err, data)=> {
            if (!data) {
                res.status(404).json({
                  message: "Does Not exist a Customer",
                  error: "404",
                });              
            }
            else{
            res.render('home',{
                data: data.map(
                    data => data.toJSON()
                    )
            });
            }
        });
    });

     // Update User
   app.get('/sendmail/:id', async (req, res) => {
    await user.findByIdAndUpdate({_id : req.params.id },{status: 0},{new: true},(err, data)=> {
            if (!data) {
                res.status(404).send({
                    message: "Error -> Can NOT update",
                    error: err
                });
            }
            else{
                res.redirect("mailto:"+ data.mail +"?subject=Bhagavad%20Gita%20API%20Authentication%20key&body=Hi%20"+ data.name +"%2C%0A%0Awelcome%20to%20the%20Bhagavad%20Gita%20API!%0AYour%20API%20key%3A%20"+ data._id +"%0A%0AUse%20it%20as%20the%20'x-api-key'%20header%20when%20making%20any%20request%20to%20the%20API%2C%20or%20by%20adding%20as%20a%20query%20string%20parameter%20e.g.%0A'api_key%3D"+ data._id +"'%0A%0AMore%20details%20on%20authentication.%0AVisit%20our%20official%20API%20Documentation.%0Adocs.bhagavadgitaapi.in%2Fapi-reference%2Fauthentication%0A%0AOr%20if%20you%20need%20any%20example%20code%2C%20or%20have%20any%20questions%20then%20checkout%20the%20forum%3A%0Ahttps%3A%2F%2Fgithub.com%2Fvedicscriptures%2Fbhagavad-gita-api%2Fdiscussions%2F3%0A%0AAll%20the%20best%2C%20Pt.%20Prashant%20Tripathi.%20https%3A%2F%2Fgithub.com%2Fptprashanttripathi%0A%0ABig%20love!");
            }
        });
    });
    
    //all user name
    app.get('/username', async (req, res) => {
        await user.find({},{"pass": 1,"_id": 0},(err, data)=> {
            if (!data) {
                res.status(404).send({
                    message: "Error -> Can NOT update",
                    error: err
                });
            } 
            else {
		res.render('username',{
                	data: data.map(data => data.toJSON())
                });    
            }
        }).sort({start:-1});
    }); 

};

module.exports = Routes;
