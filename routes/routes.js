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
                console.log(data);
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
            count: req.body.count
        });
        userData.save(function (err, result) {
            if(!result){
                res.status(400).send({
                    message: "Can NOT add user",
                    error: err
                });
            }
            else{
                res.redirect('/?alert='+result._id +' User added successfully.');
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
};

module.exports = Routes;