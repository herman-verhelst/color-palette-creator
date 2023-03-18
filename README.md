# Color palette creator

With these scripts you can create a color palette from images.

## Requirements
Python installation with extcolors. 

extcolors can be installed with the following command.

```
!pip install extcolors
```

## How to use these scripts
Place the images from which you want to extract a color palette in a folder called `images` in CreatePalette.

Run `list_images.py`. An `input.json` file with a list of all your images will be created.

```
python3 list_images.py
```

In this file you can change the parameters for the color palette extraction.

|Parameters|Explanation|
|---|---|
|tolerance|Group colors to limit the output and give a better visual representation. Based on a scale from 0 to 100. Where 0 won’t group any color and 100 will group all colors into one.| 
|limit|Upper limit to the number of extracted colors presented in the output.|
|finished|When `true`, this image will be skipped, which decreases the processing time.|

When you run `palette_creator.py` an `output.json` file will be created in the `PaletteViewer` folder. This file is used for displaying the image with the corresponding color palette on an website. 

```
python3 pallette_creator.py
```

|Displayed Columns|Explanation|
|---|---|
|Color code|Hexadecimal value for your color, when clicking on this table cell, the code will be copied to your clipboard.|
|Number of occurences|How many pixels have this color.|
|Percentage|A percentage of the occurence of the color|
|Percentage rounded to 5%|A percentage of the occurence of the color, rounded to 5%. When not all colors are displayed, a conversion will be made.|
|Color name|Here you can give your color a name. These names won't be saved, unless you press the **Download file** button. This generates an json file. This file can be uploaded for use in a later session.|

## Used tutorial
[Image Color Extraction with Python in 4 Steps](https://towardsdatascience.com/image-color-extraction-with-python-in-4-steps-8d9370d9216e)
