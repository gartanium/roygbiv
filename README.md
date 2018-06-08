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

###To use the improved version
1. Select a csv file to upload that has gene expression data for differing regions of the brain, then select upload.
2. Select a gene to display and any other additional options.
3. Selecct render when your ready.

###Camera
1. Users can save the camera position of their brain.
2. *NOTE* Does not work when the camera is zoomed in or out!!!

Note:
* If you want your downloaded or generated data stored at specific location, please define the `ROYGBIV_PATH` environment variable.
