import json

from os import listdir


def list_images(path):
    images = []
    for image in listdir(path):
        images.append({
            "file": path + "/" + image,
            "tolerance": 20,
            "limit": 4,
            "finished": False
        })

    print(f'Found {len(listdir(path))} images')

    with open('./input.json', 'w') as input_file:
        json.dump(images, input_file)


if __name__ == '__main__':
    list_images('./images')
