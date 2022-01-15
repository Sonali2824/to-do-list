//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const lodash=require("lodash");

const app = express();

//mongoose
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-sonali:test123@cluster0.ujk2l.mongodb.net/todolistDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

//Items Schema and Model
const itemsSchema=({
  name:"String"
});
//mongoose model is generally capitalized
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"Buy Milk"
});
const item2=new Item({
  name:"Buy Eggs"
});
const item3=new Item({
  name:"Buy Jam"
});



let itemsDB=[]
//find elements
Item.find(function(err,results){
  if(results.length===0)
  {
    //insert item documents
   Item.insertMany([
     item1,item2,item3
   ]).then(function(){
       console.log("Data inserted")  // Success
   }).catch(function(error){
       console.log(error)      // Failure
   });
  }

results.forEach(function(res){
  if(!itemsDB.includes(res.name))
  {itemsDB.push(res.name);}
}

)});


app.get("/", function(req, res) {



  res.render("list", {listTitle: "Today", newListItems: itemsDB});

});

app.post("/", function(req, res){

  const item = req.body.newItem;
const title=req.body.list;

    const item_v= new Item({
      name:item
    });
    if(title=="Today")
    {
      item_v.save();
      itemsDB.push(item);
      res.redirect("/");
    }
    else{
      List.findOne({name:title},function(err,foundList){
        foundList.items.push(item_v);
        foundList.save();
        res.redirect("/"+title);
      });
    }

});
function arrayRemove(arr, value) {

        return arr.filter(function(ele){
            return ele != value;
        });
    }
app.post("/delete", function(req, res){
const title1=req.body.listName;
  const item_d = req.body.checkbox;
  console.log(item_d);
    if(title1=="Today"){
      Item.deleteOne({ name: item_d }).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    itemsDB = arrayRemove(itemsDB, item_d);
    res.redirect("/");
    }
    else{
      List.findOneAndUpdate({name: title1}, {$pull: {items: {name: item_d}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + title1);
        }
      });

    }




});
 //List Schema
const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);



app.get("/:param", function(req,res){
const customList=lodash.capitalize(req.params.param);

List.findOne({name:customList},function(err,foundList){
  if(!err){
    if(!foundList)
    {
      //create a list
      const list=new List({
        name:customList,
        items: [
          item1,item2,item3
        ]
      });
      list.save();
      res.redirect("/"+customList);
    }
    else{
      //show a list
      let itemsL=[];
      foundList.items.forEach(function(res){
        if(!itemsL.includes(res.name))
        {itemsL.push(res.name);}
      });

res.render("list", {listTitle: foundList.name, newListItems: itemsL});
    }
  }
});


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
