import { getMinifiedRecords, table } from "../../lib/airtable";

const favoriteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;
      if (id) {
        const findCoffeeRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();
        if (findCoffeeRecords.length !== 0) {
          // find by id and if exists then return the record
          const recordArr = getMinifiedRecords(findCoffeeRecords);
          const record = recordArr[0];

          const calculateVote = parseInt(record.voting) + 1;
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVote,
              },
            },
          ]);
          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.status(404).send({ message: "No records" });
        }
      } else {
        res.send({ message: "Id is required" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

export default favoriteCoffeeStoreById;
