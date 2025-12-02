/*const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2':
        const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
        menu();
        break;

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;
            case '5':
          rl.question('Enter search keyword: ', keyword => {
            const results = db.searchRecords(keyword);

            if (results.length === 0) {
              console.log('No records found.');
            } else {
              console.log(`Found ${results.length} matching record(s):`);
              results.forEach(r =>
                console.log(`ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`)
              );
            }

            menu();
          });
      break;
      case '6':
          console.log(`
        Choose field to sort by:
        1. Name
        2. Creation Date
          `);

          rl.question('Enter choice: ', fieldChoice => {
            let field = null;

            if (fieldChoice.trim() === '1') field = 'name';
            else if (fieldChoice.trim() === '2') field = 'created';
            else {
              console.log('Invalid field choice.');
              return menu();
            }

            console.log(`
        Choose order:
        1. Ascending
        2. Descending
            `);

            rl.question('Enter choice: ', orderChoice => {
              let order = null;

              if (orderChoice.trim() === '1') order = 'asc';
              else if (orderChoice.trim() === '2') order = 'desc';
              else {
                console.log('Invalid order choice.');
                return menu();
              }

              const sorted = db.sortRecords(field, order);

              console.log('Sorted Records:');
              sorted.forEach(r => {
                console.log(`ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
              });

              menu();
            });
          });
          break;
      case '7':
          const fs = require('fs');
          
          const recordsToExport = db.listRecords();
          const fileName = 'export.txt';
          const now = new Date();

          let header = `Vault Export File\n`;
          header += `Generated On: ${now.toISOString()}\n`;
          header += `Total Records: ${recordsToExport.length}\n`;
          header += `File Name: ${fileName}\n`;
          header += `------------------------------\n\n`;

          let body = '';

          recordsToExport.forEach((r, i) => {
            body += `${i + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.created}\n`;
          });

          fs.writeFileSync(fileName, header + body);

          console.log(`Data exported successfully to ${fileName}.`);
          menu();
          break;
      case '8':
        const stats = db.getVaultStatistics();
        console.log(stats);
         menu();  
        break;
      case '9':
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;

      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();*/

const readline = require("readline");
const db = require("./db");
require("./events/logger"); // Initialize event logger
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
  `);

  rl.question("Choose option: ", async (ans) => {
    switch (ans.trim()) {
      // ------------------ ADD RECORD ------------------
      case "1":
        rl.question("Enter name: ", (name) => {
          rl.question("Enter value: ", async (value) => {
            await db.addRecord({ name, value });
            console.log("✅ Record added successfully!");
            menu();
          });
        });
        break;

      // ------------------ LIST RECORDS ------------------
      case "2":
        const records = await db.listRecords();
        if (records.length === 0) console.log("No records found.");
        else
          records.forEach((r) =>
            console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`)
          );
        menu();
        break;

      // ------------------ UPDATE RECORD ------------------
      case "3":
        rl.question("Enter record ID to update: ", (id) => {
          rl.question("New name: ", (name) => {
            rl.question("New value: ", async (value) => {
              const updated = await db.updateRecord(id, name, value);
              console.log(updated ? "✅ Record updated!" : "❌ Record not found.");
              menu();
            });
          });
        });
        break;

      // ------------------ DELETE RECORD ------------------
      case "4":
        rl.question("Enter record ID to delete: ", async (id) => {
          const deleted = await db.deleteRecord(id);
          console.log(deleted ? "🗑️ Record deleted!" : "❌ Record not found.");
          menu();
        });
        break;

      // ------------------ SEARCH ------------------
      case "5":
        rl.question("Enter search keyword: ", async (keyword) => {
          const results = await db.searchRecords(keyword);
          if (results.length === 0) console.log("No records found.");
          else {
            console.log(`Found ${results.length} matching record(s):`);
            results.forEach((r) =>
              console.log(
                `ID: ${r.id} | Name: ${r.name} | Created: ${r.createdAt}`
              )
            );
          }
          menu();
        });
        break;

      // ------------------ SORT ------------------
      case "6":
        console.log(`
Choose field to sort by:
1. Name
2. Creation Date
        `);

        rl.question("Enter choice: ", (fieldChoice) => {
          let field = null;
          if (fieldChoice.trim() === "1") field = "name";
          else if (fieldChoice.trim() === "2") field = "createdAt";
          else {
            console.log("Invalid field choice.");
            return menu();
          }

          console.log(`
Choose order:
1. Ascending
2. Descending
          `);

          rl.question("Enter choice: ", async (orderChoice) => {
            let order = null;
            if (orderChoice.trim() === "1") order = "asc";
            else if (orderChoice.trim() === "2") order = "desc";
            else {
              console.log("Invalid order choice.");
              return menu();
            }

            const sorted = await db.sortRecords(field, order);

            console.log("Sorted Records:");
            sorted.forEach((r) =>
              console.log(
                `ID: ${r.id} | Name: ${r.name} | Created: ${r.createdAt}`
              )
            );

            menu();
          });
        });
        break;

      // ------------------ EXPORT DATA ------------------
      case "7":
        const recordsToExport = await db.listRecords();
        const fileName = "export.txt";
        const now = new Date();

        let header = `Vault Export File\n`;
        header += `Generated On: ${now.toISOString()}\n`;
        header += `Total Records: ${recordsToExport.length}\n`;
        header += `File Name: ${fileName}\n`;
        header += `------------------------------\n\n`;

        let body = "";
        recordsToExport.forEach((r, i) => {
          body += `${i + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}\n`;
        });

        fs.writeFileSync(fileName, header + body);

        console.log(`Data exported successfully to ${fileName}.`);
        menu();
        break;

      // ------------------ VIEW STATISTICS ------------------
      case "8":
        const stats = await db.getVaultStatistics();
        console.log(stats);
        menu();
        break;

      // ------------------ EXIT ------------------
      case "9":
        console.log("👋 Exiting NodeVault...");
        await db.closeDB(); // close MongoDB connection
        rl.close();         // close readline interface
        process.exit(0);
        break;

      default:
        console.log("Invalid option.");
        menu();
    }
  });
}

menu();

