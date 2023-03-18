# https://towardsdatascience.com/image-color-extraction-with-python-in-4-steps-8d9370d9216e

import json
import extcolors

from PIL import Image
from pathlib import Path


def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)


def resize_image(file_name):
    default_long_edge = 1920
    img = Image.open(file_name)

    if img.size[0] > img.size[1]:
        width_percent = (default_long_edge / float(img.size[0]))
        height = int((float(img.size[1]) * float(width_percent)))
        img = img.resize((default_long_edge, height), Image.LANCZOS)
        resize_name = './images/resize_' + Path(file_name).stem + Path(file_name).suffix
        img.save(resize_name)
    else:
        height_percent = (default_long_edge / float(img.size[1]))
        width = int((float(img.size[0]) * float(height_percent)))
        img = img.resize((width, default_long_edge), Image.LANCZOS)
        resize_name = './images/resize_' + Path(file_name).stem + Path(file_name).suffix
        img.save(resize_name)
    return resize_name


def check_if_file_in_output(output_content, file):
    for i in range(len(output_content)):
        if file in output_content[i].values():
            return i
    return -1


def exact_color(input_file_name):
    with open(input_file_name) as input_file:
        input_content = json.loads(input_file.read())

    with open('../PaletteViewer/output.json') as output_file:
        output_content = json.loads(output_file.read())

    for i in range(len(input_content)):
        if not input_content[i]["finished"]:
            # img_url = resize_image(input_content[i]["file"])
            img_url = input_content[i]["file"]
            tolerance = input_content[i]["tolerance"]
            palette_size = input_content[i]["limit"]

            palette = extcolors.extract_from_path(img_url, tolerance, palette_size)
            total_pixels = Image.open(img_url).width * Image.open(img_url).height
            colors = []

            for color in palette[0]:
                colors.append({
                    'hexValue': rgb_to_hex(color[0][0], color[0][1], color[0][2]),
                    'occurrences': color[1],
                    'occurrencesPercentage': color[1] / total_pixels
                })

            if check_if_file_in_output(output_content, input_content[i]["file"]) >= 0:
                output_content[check_if_file_in_output(output_content, input_content[i]["file"])]["palette"] = colors
            else:
                output_content.append({
                    'file': input_content[i]["file"],
                    'palette': colors
                })
            print(f'{((i + 1) / len(input_content)):2.2%} - Extracted color palette from image [{input_content[i]["file"]}]')
        else:
            print(f'{((i + 1) / len(input_content)):2.2%} - Skipped image [{input_content[i]["file"]}]')

    with open('../PaletteViewer/output.json', 'w') as output_file:
        json.dump(output_content, output_file)


if __name__ == '__main__':
    exact_color('./input.json')
