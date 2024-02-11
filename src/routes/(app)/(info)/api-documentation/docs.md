# API Documentation

Welcome to The Redstone Index API Documentation, providing specifications and examples for
integrating the API with Minecraft servers or mods.

- [API Documentation](#api-documentation)
  - [Schematics](#schematics)
    - [List of Schematic Details (JSON)](#list-of-schematic-details-json)
    - [Get Schematic Details (JSON)](#get-schematic-details-json)
    - [Upload Schematic](#upload-schematic)
    - [Download Schematic](#download-schematic)

## Schematics

### List of Schematic Details (JSON)

Query String Parameters:
* `username` (optional) - Filter schematics to matching username. Defaults to alphanumeric username order.
* `offset` (optional) - Skip the first `offset` rows. Defaults to 0.
* `limit` (optional) - Define the number of returned rows. Defaults to 20.

Example Request:
```
GET /api/schematics?username=SuperPlasma
```

Example Response:
```json
[
    {
        "id": 1,
        "created_at": "2024-01-03T06:42:20.566248+00:00",
        "author": {
            "username": "SuperPlasma",
            "numeric_id": 1
        },
    },
    // ...other schematic details
]
```

### Get Schematic Details (JSON)

Route Parameters:
* **Schematic ID** (required) - ID for the schematic.

Example Request:
```
GET /api/schematics/1
```

Example Response:
```json
[
    {
        "id": 1,
        "created_at": "2024-01-03T06:42:20.566248+00:00",
        "author": {
            "username": "SuperPlasma",
            "numeric_id": 1
        }
    }
]
```

### Upload Schematic

Header Parameters:
* `x-api-token` (required) - API token configured for your Redstone Index account.

Body Data:
* **Blob file data** (required) - Schematic file data

Example Request:
```bash
curl -X POST \
  -H "x-api-token: 9417210271194205" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@./static/piston_trapdoor.nbt" \
  http://redstoneindex.org/api/schematics
```

Example Response:
```json
{
    "success": true,
    "id": 320
}
```

Note: After upload, the schematic will appear in your account in your schematics list.

### Download Schematic

Route Parameters:
* **Schematic ID** (required) - ID for the schematic.

Example Request:
```
GET /api/schematics/304/download
```

Downloaded File: `schematic_304.nbt`