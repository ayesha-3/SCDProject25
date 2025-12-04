NodeVault

NodeVault is a simple Node.js-based vault application that allows you to securely manage records. 
It provides functionalities such as adding, listing, updating, deleting, searching, sorting, 
and exporting records, along with viewing vault statistics. The backend is built with Node.js, 
and MongoDB is used as the database.

Features:
- Add new records
- List all records
- Update existing records
- Delete records
- Search records
- Sort records
- Export data
- View vault statistics


Prerequisites:
- Docker
- Docker Compose

Setup & Run:

1. Clone the repository:
   git clone <your-repo-url>
   cd SCDProject25

2. Configure Environment Variables:
   Create a .env file inside the backend/ directory (if not already present) and add your MongoDB URI:
   
   MONGO_URI=mongodb://database:27017/nodevault
   PORT=3000

   Note: Make sure the database hostname matches the service name in docker-compose.yml ("database").

3. Using Docker Compose:

   a) Build and run containers in the foreground:
      docker-compose up --build

      - This will rebuild the backend image and start MongoDB and the backend service.
      - Logs will appear in your terminal.
      - Press Ctrl+C to stop.

   b) Run containers in detached mode (background):
      docker-compose up -d --build

      - Starts services in the background.
      - View logs with:
         docker-compose logs -f backend
         docker-compose logs -f database

4. Access Backend CLI:
   Once the containers are running, you can access the backend CLI:

   docker exec -it nodevault-backend sh

   Inside the container, the CLI menu will appear:

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
   Choose option:

Stopping the Application:
- To stop and remove containers:
  docker-compose down

- MongoDB data persists in the Docker volume "mongo_data".

Docker Notes:
- MongoDB runs in a separate container named "nodevault-db" with a persistent volume "mongo_data".
- Backend runs in a container named "nodevault-backend".
- Both services are connected via a Docker network "nodevault-network".

Troubleshooting:
- MongoDB connection issues: Make sure the hostname in .env matches the service name in docker-compose.yml.
- Logs too verbose: Use detached mode with "docker-compose up -d" to reduce log clutter.
- Stopping containers: Use "docker-compose down" if Ctrl+C doesn’t terminate foreground containers.


