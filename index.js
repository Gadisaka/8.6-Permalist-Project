import express from "express";
import bodyParser from "body-parser";
import pg  from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "permalist",
  password : "1234",
  port : 5432
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// async function getList(){
//   const result = await db.query("SELECT * FROM ITEMS")
//   result.rows.forEach(item => {
//     items.push(item)
//   });
//   console.log(items);
  
// }
// getList()


app.get("/", async(req, res) => {
  const result =await db.query("SELECT * FROM items ORDER BY id ASC")
  let items = result.rows
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  if(item === ""){
    res.redirect("/")
  }else{
    db.query("INSERT INTO items(title) VALUES ($1)" , [item])
    // items.push({ title: item });
    res.redirect("/");
  }
});

app.post("/edit", (req, res) => {
  const updated_item_id = req.body.updatedItemId
  const updated_item = req.body.updatedItemTitle
  if(updated_item === ""){
    res.redirect("/")
  }else{
    db.query("UPDATE items SET title = $1 WHERE id = $2" , [updated_item , updated_item_id])
    // const it = items.findIndex(it => it.id == updated_item_id)
    // items[it].title = updated_item
    res.redirect("/") 
  }
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId
  db.query("DELETE FROM items WHERE id = $1" , [id])
  // const it = items.findIndex(it => it.id == id)
  // items.splice(it , 1)
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
