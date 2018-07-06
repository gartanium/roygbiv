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

-Z-Score-Gene: This option normalizes the data relative to each gene. The data in a different gene does not effect how the selected gene is normalized. By default, the standard scale has a minimum of 3 standard deviations, a mid of 0, and a maximum of 3 standard deviations. If any of the cells has a zscore value greater than 3 or less than -3, the scale is expanded.

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





