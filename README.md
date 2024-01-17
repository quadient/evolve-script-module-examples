# Evolve Script Module Examples
This repository contains examples of custom pipeline modules written in typescript.
Examples are in the following folders:
- `csv-transform-example` - example of custom transformation of CSV data into JSON.
- `json-transform-example` - example of processing JSON data, manipulating some fields in the input 
          and enriching the objects with 
- `realtime-data-api-example` - example of using Digital Delivery Realtime Data API
- `front-office-integration-examples` - examples of integrating Generate and Front Office
- `insert-cover-pages-example` - example of adding specified documents to the beginning or end of each document in a record

## Pre-requisities
Following tools are needed to be installed to be able to build the example modules.
 - NodeJS
 - Yarn
 - [Bobril build](https://github.com/bobril/bbcore)
 - [swarm](https://www.npmjs.com/package/@quadient/swarm)

## How to build
The examples are built via the swarm utility. For each example, use swarm to log in to Cloud and upload the script.
In commandline switch to the folder of the example, e. g. [json-transform-example](json-transform-example) and run the following command:

```shell
swarm login
swarm script upload
```

The testing input data file is [example-input.json](json-transform-example/example-input.json), resp. [example-input.csv](csv-transform-example/example-input.csv) 

## CSV Example with Pipeline
Follow the [detail description](csv-transform-example/README.md).

## Walk-through the source code
TODO
