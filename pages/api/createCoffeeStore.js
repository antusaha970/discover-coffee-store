import { table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { id, name, address, neighbourhood, imgUrl, voting } = req.body;
      if (id) {
        const findCoffeeRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();
        if (findCoffeeRecords.length !== 0) {
          // find by id and if exists then return the record
          const record = getMinifiedRecords(findCoffeeRecords);
          res.json(record);
        } else {
          if (name) {
            // If not exist then create the record
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  imgUrl,
                  voting,
                },
              },
            ]);
            const madeRecord = getMinifiedRecords(createRecord);
            res.json(madeRecord);
          } else {
            res.json({ message: "Please provide a name" });
          }
        }
      } else {
        res.json({ message: "Please provide an id" });
      }
    }
  } catch (error) {
    res.json({ error });
  }
};

export default createCoffeeStore;
