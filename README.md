# Database Schema Visualizer

Database Schema Visualizer is a web-based tool for visualizing and editing database schemas. The tool allows users to create, modify, and connect tables using an intuitive drag-and-drop interface. The visualizer supports both one-to-one and many-to-one relationships between tables.

## Why create this?

You may ask why this app when there are a lot of other ones available to create database diagrams that export directly to SQL dialects, JSON and other formats.

I needed a way to evaluate student's homework when covering these database diagrams in a class, to automate the process with other apps, I would need to make them use one of those, generate an intermediate format and paste the exported data into an evaluator to compare with the expected solution, so to avoid that, as this is a react component, you can embed it into any LMS written in react and integrate it so that student's don't need to worry about exporting and pasting, just click the export button and the app handles the API call or evaluation step automatically.

This project is very basic to meet my specific needs but would like to extend it further and fix the problems that it may have and haven't cosidered yet. Feel free to propose changes to improve it as it is free for anyone to use it.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
2. **Install dependencies:**

   Using npm:

   ```sh
   npm install
   ```

3. **Start the development server:**

   Using npm:

   ```sh
   npm run dev
   ```

4. **Open the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Add a Table:**
    - Click on the empty pane to add a new table.
    - Double-click on the table name to edit it.

2. **Add Attribute**
    - Hover over the table to show the add button `+`.
    - Click on it to add an empty row.

3. **Remove Attribute**
    - Hover over an attribute to show the remove button on the right `-`.
    - Click on it to remove the attribute.

4. **Edit Table Attributes:**
    - Double-click on an attribute's key, name or type to edit it.
    - Use the combo box to select the type of the attribute and edit it if is the type.

5. **Define Relationships:**
    - Drag and connect the handles to create relationships between tables.
    - Double-click on an edge to switch between one-to-one and many-to-one relationships.

6. **Export Diagram:** 
    - Click on the export button (last one) in the controls to export the current state of the diagram to JSON format.

## Preview
<p style="text-align: center;">
<img src="/public/diagrams.gif" alt="diagram gif" width="70%" />
</p>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
