<strong>Project Title: Inventory Management App</strong>

<strong>Description:</strong>

I developed an Inventory Management App designed for an imaginary store to practice and reinforce my skills in full-stack development. This application enables users to manage various categories and items within an inventory, supporting all CRUD (Create, Read, Update, Delete) operations. It provides a comprehensive system to handle product data efficiently.

<strong>Technologies Used:</strong>

<ul>
  <li><strong>Express.js:</strong> For server-side logic and routing.</li>
  <li><strong>MongoDB:</strong> For database management and data storage.</li>
  <li><strong>Node.js:</strong> As the runtime environment for executing JavaScript server-side.</li>
  <li><strong>JavaScript:</strong> For client-side and server-side scripting.</li>
  <li><strong>HTML/CSS:</strong> For structuring and styling the web pages.</li>
</ul>
<strong>Features:</strong>

<ul>
  <li><strong>Category Management:</strong>
    <ul>
      <li><strong>Create:</strong> Add new categories to the inventory.</li>
      <li><strong>Read:</strong> View a list of all categories.</li>
      <li><strong>Update:</strong> Modify existing category details.</li>
      <li><strong>Delete:</strong> Remove categories from the inventory, with automatic removal of associated items.</li>
    </ul>
  </li>
  <li><strong>Item Management:</strong>
    <ul>
      <li><strong>Create:</strong> Add new items under specific categories.</li>
      <li><strong>Read:</strong> View details of items and filter them by category.</li>
      <li><strong>Update:</strong> Edit item details such as price, quantity, and name.</li>
      <li><strong>Delete:</strong> Remove items from the inventory.</li>
    </ul>
  </li>
  <li><strong>User Interface:</strong>
    <ul>
      <li><strong>Read Views:</strong> Display categories and items in a user-friendly manner.</li>
      <li><strong>Forms:</strong> For creating and updating categories and items.</li>
      <li><strong>Responsive Design:</strong> Ensure the application is functional and visually appealing across different devices.</li>
    </ul>
  </li>
  <li><strong>Data Integrity:</strong> Implemented logic to handle the deletion of categories, ensuring associated items are also removed to maintain data consistency.</li>
  <li><strong>Deployment:</strong> Deployed the application to a cloud platform, making it accessible online for users.</li>
</ul>



To run this Express app locally, follow these steps:

Ensure you have Node.js and npm installed: You can check this by running the following commands in your terminal:

bash
Copy code
node -v
npm -v
If you don’t have them installed, download and install Node.js from https://nodejs.org/, which includes npm.

Navigate to your project directory: Open your terminal or command prompt and navigate to the root of your project:

bash
Copy code
cd path/to/your/project
Install dependencies: Run the following command to install all the necessary dependencies specified in your package.json:

bash
Copy code
npm install
Set up environment variables (optional): If the project requires environment variables, you should create a .env file in the root of your project and define those variables. For example:

makefile
Copy code
PORT=3000
DB_URI=your_database_uri
Run the application:

For production mode:
bash
Copy code
npm start
For development mode with live reloading (using nodemon):
bash
Copy code
npm run serverstart
The serverstart script sets up the environment variable DEBUG for detailed logging and runs the app using nodemon, which watches for file changes and automatically restarts the server.

Open the app in your browser: By default, the app will run on port 3000. Open your browser and navigate to:




