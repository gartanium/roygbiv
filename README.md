roygbiv (Roy G. Brain Image Viewer) is an interactive browser-based visualization of cortical surfaces.

Instructions for running demos are below. To run demos locally, install the `flask` Python package.


###To set up the main demo locally:

1. Run `python get_data.py demo`. This will download sample data files.
2. Run `server.py` to launch a light-weight web server
3. Browse to `http://127.0.0.1:5000/`


###To set up the `two hemis` demo locally:
1. Install vtk
2. Install mindboggle (`pip install git+https://github.com/binarybottle/mindboggle.git`)
3. Run `python get_data.py fsaverage` (or replace `fsaverage with your desired freesurfer subject)
4. Run `python server.py` to launch a light-weight web server
5. Browse to `http://127.0.0.1:5000/fsaverage/desikan/pial/two_hemis.html`

You can change parameters above and change the corresponding URL:
    * Use your subject ID instead of `fsaverage`, if you have your own data.
    * Use `--atlas destrieux` to use a smaller parcellation.
    * Use `--surface inflated` to view an inflated surface.

###To deploy your files remotely
1. Create the data (see above)
2. Upload all files to your remote web server (html, json, css, data)
3. Browse to `http://your_web_server/your_roygbiv_directory/`

Note:
* If you want your downloaded or generated data stored at specific location, please define the `ROYGBIV_PATH` environment variable.


####################################################################################
Extended version - Author Matthew Brown (Built off of previous work of Mckay Davis)
####################################################################################

**********************************
ABOUT
**********************************
The purpose of the improved version of ROYGBIV is to display gene expression data onto a given brain template surface. It is for medical researchers who wish to
visiualize gene expression data on the brain.

**********************************
GETTING STARTED
**********************************
To run the webpage locally, in the command prompt, navigate to roygbiv/roygbiv/web and run: python -m http.server
then navigate to localhost:8000 on your browser.

Inorder to display a brain, a user must have a csv file containing a column of genes, followed by several columns of brain region data. An example of a valid csv file is found in roygbiv/web/data. The name of the file is ExampleData.csv. Notice that the csv file contains a header, followed by rows that are headed by a gene.

After a csv file is selected that contains gene expression data, the user must select
one of those genes to be visiualized on the brain surface template. There are several
options that a user can include as well.

**********************************
Options
**********************************
There are several options a user can select to customize the visuilization of the gene expression data. They are as follows.

1. Normalization
----------------------------------
The user has the option to normalize the gene expression data that is displayed. For this option to take effect, the user must re-render the brain surface.

-Default: By default, the data is scaled by selecting the minimum, mean, and maximum values.

-Z-Score-Gene: This option normalizes the data relative to each gene. The data in a different gene does not effect how the selected gene is normalized. By default, the standard scale has a minimum of 3 standard deviations, a mid of 0, and a maximum of 3 standard deviations. If any of the cells has a zscore value greater than 3 or less than -3, the scale is expanded to the smallest whole number above that min or max.

-Z-Score-Region: This option normalizes the data relative to each brain region. This means that the cell for a given brain region in each gene is normalized relative to eachother. For example, all the cells in the ctx-lh-insula brain region are normalized relative to each other while all the cells in the ctx-lh-precentral region are normalized relative to each other. By default, the standard scale has a minimum of 3 standard deviations, a mid of 0, and a maximum of 3 standard deviations. If any of the cells has a zscore value greater than 3 or less than -3, the scale is expanded.

2. Camera
----------------------------------
The user has the option to save the position of the camera, and restore it. To save a camera position, the user simply enters in a name next to the camera label, and clicks "Snapshot" to save it. This creates a button that upon being clicked will restore the position.

3. Surface Selection
----------------------------------
The user has the option to select the surface to be used as a template for visiuilizaing gene expression data. This is done by selecting one of the surfaces in the surface selection drop box. The brain must be re-rendered for it to take effect.

4. Region Display
----------------------------------
The user has the option to select which regions are "displayed" by selecting differing checkboxes next to a region name. This feature is rough at the moment, because the meshes are only surfaces and not filled. In addition, what this feature really does is set the opacitiy of a mesh to 0-meaning that when a "hidden" mesh is looked at, it hides visible meshes behind it.

5. Color Scale
----------------------------------
The user has the option to select which colors are used for displaying the brain. Three colors are required, a minimum, middle, and maximum. The user can enter in a hexadecimal code such as #ffffff (preceded by a #) to choose as a color.

6. Background Color
----------------------------------
The user can select a background color for the brain surface. This is simply done by selecting the color box and choosing a color.

**********************************
Background features
**********************************
1. Uploading a csv file containing gene expression data.
----------------------------------
There is a little bit of data preperation that occurs when the user enters in a csv file for region expression data. The way it loads in data is based off the file formats I was given from the team of medical researchers we are working with. An example of an acceptable csv file format is found in the roygbiv/data/web/data/ExampleData.csv file.

**********************************
Development notes
**********************************
Getting Started
----------------------------------
To start off, I would recommend familiarizing your self with Angular JS and JQuery. This will give you a good foundation for understanding how to connect your view, with your models and controllers. You don't need to dig to deep into Angular JS, just enough to understand that the main entry point for you application is found in the csv_file_loading.js file. Understand that this is the flow of the application. 1. A user enters in a CSV file for region expression data. 2. A user selects a gene. Once the user does 1 and 2, then all the magic happens. You will notice in the csv_file_loading.js file that once a user has a file entered in, a gene selected, and then render pressed, all the events to each button is registered, and a brain is rendered onto the screen.

1. Adding more surfaces
----------------------------------
-Supported file types: Currently, this version of ROYGBIV supports loading of OBJ files. VTK files should be resupported again soon. The current problem is that I updated three.min.js. I updated so that .obj files could be loaded in with out any errors. The problem is that when I updated three.min.js and VTKLoader.js, VTKLoader.js stopped loading the surfaces correctly. I will work on this. It should be fairly simple to add more file types as well. To add support for more file types, checkout this link https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders, include the appropriate loader into the project, and learn specificly what your loader returns. For example, the VTK loader returns a GeometryBuffer where as the OBJLoader returns a "group" object (really a group object is a 3DObject). To add code for other filetypes, checkout the loadmesh function and follow the example there.

-Adding more surfaces: ROYGBIV loades multiple mesh files and displays them. To add more "Surface templates", you will need meshes for multiple regions of the brain. These are the regions that you need: 

ctx-lh-caudalanteriorcingulate
ctx-lh-caudalmiddlefrontal
ctx-lh-cuneus
ctx-lh-entorhinal
ctx-lh-fusiform
ctx-lh-inferiorparietal
ctx-lh-inferiortemporal
ctx-lh-isthmuscingulate
ctx-lh-lateraloccipital
ctx-lh-lateralorbitofrontal
ctx-lh-lingual
ctx-lh-medialorbitofrontal
ctx-lh-middletemporal
ctx-lh-parahippocampal
ctx-lh-paracentral
ctx-lh-parsopercularis
ctx-lh-parsorbitalis
ctx-lh-parstriangularis
ctx-lh-pericalcarine
ctx-lh-postcentral
ctx-lh-posteriorcingulate
ctx-lh-precentral
ctx-lh-precuneus
ctx-lh-rostralanteriorcingulate
ctx-lh-rostralmiddlefrontal                                     
ctx-lh-superiorfrontal
ctx-lh-superiorparietal
ctx-lh-superiortemporal
ctx-lh-supramarginal
ctx-lh-transversetemporal
ctx-lh-insula

Store these files in data\mindboggled\Twins-2-1\labels\left_exploded_labels_vtks. Store it in a folder (I recommend calling it after the next iteration of surface files such as Surface_X).
You will also need a JSON file to describe where the location is of each brain region mesh. checkout the lh_files_to_load_surfaceX.JSON files.

2. Manipulationg region data
----------------------------------
-About: The purpose of the extended version of ROYGBIV is to show gene expression data on a brain surface. The brain surface is composed of several meshes. Each mesh is assigned a specific color and region ID. The color is calculated based upon the data located at the Region ID in the gene expression data csv file. 

-Normalization:
Options are chosen to manipulate this data as well, such as z-score normalization. To add aditional ways to modify this data, open up the RegionColorFactory.js file. 