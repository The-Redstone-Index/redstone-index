import json
import random
import sys

# Probability of a chosen block being an air block
prob_air_block = 0.5

# Palette of blocks to choose from
palette = [
    {
        'Name': "minecraft:air"
    },
    {
        'Name': "minecraft:white_wool"
    },
    {
        'Properties': {
            'facing': "east",
            'extended': "false"
        },
        'Name': "minecraft:sticky_piston"
    },
    {
        'Properties': {
            'facing': "up",
            'extended': "false"
        },
        'Name': "minecraft:sticky_piston"
    },
    {
        'Properties': {
            'facing': "east",
            'extended': "false"
        },
        'Name': "minecraft:piston"
    },
    {
        'Properties': {
            'facing': "up",
            'extended': "false"
        },
        'Name': "minecraft:piston"
    },
    {
        'Properties': {
            'face': "wall",
            'powered': "false",
            'facing': "north"
        },
        'Name': "minecraft:lever"
    },
    {
        'Properties': {},
        'Name': "minecraft:redstone_block"
    },
    {
        'Properties': {
            'east': "none",
            'south': "side",
            'north': "none",
            'west': "side",
            'power': "0"
        },
        'Name': "minecraft:redstone_wire"
    },
    {
        'Properties': {
            'east': "none",
            'south': "side",
            'north': "side",
            'west': "none",
            'power': "0"
        },
        'Name': "minecraft:redstone_wire"
    },
    {
        'Properties': {
            'east': "side",
            'south': "side",
            'north': "none",
            'west': "none",
            'power': "0"
        },
        'Name': "minecraft:redstone_wire"
    },
    {
        'Properties': {
            'delay': "2",
            'powered': "false",
            'facing': "north",
            'locked': "false"
        },
        'Name': "minecraft:repeater"
    }
]

# Base NBT data
schematic = {
    "size": [0, 0, 0],
    "entities": [],
    "blocks": [],
    "palette": palette,
    "DataVersion": 3120
}


def main():
    """
    Generate an SNBT (JSON file) for a redstone contraption.
    """
    # Define the size of the build
    build_size = [0, 0, 0]
    if len(sys.argv) > 1:
        # Access the first argument (dimension size)
        dimensions_size = int(sys.argv[1])
        if (dimensions_size <= 1):
            print("Dimensions size parameter should be greater than 1!")
            return
        build_size = [dimensions_size, dimensions_size, dimensions_size]
        schematic['size'] = build_size
        print(
            f"Creating schematic with dimensions: {'x'.join(map(str, build_size))}")
    else:
        print("Please provide the dimension size as the first argument!")
        return

    # Randomly populate the build with blocks
    for x in range(build_size[0]):
        for y in range(build_size[1]):
            for z in range(build_size[2]):
                # Choose between air block or palette based on probability of air block
                if random.random() < prob_air_block:
                    continue
                # Randomly choose a block from the palette
                chosen_block = random.choice(palette)
                schematic["blocks"].append({
                    "pos": [x, y, z],
                    "state": palette.index(chosen_block)
                })

    # Save the build as JSON
    with open('random_build.json', 'w') as file:
        json.dump(schematic, file, indent=2)
    print('Saved schematic SNBT to random_build.json')
    print('Done!')


if __name__ == '__main__':
    main()
