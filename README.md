# Evolve Script Module Examples
This repository contains examples of custom pipeline modules written in typescript.
Examples are in the following folders:
- `csv-transform-example` - example of custom transformation of CSV data into JSON.
- `json-transform-example` - example of processing JSON data, manipulating some fields in the input 
          and enriching the objects with 

## Pre-requisities
Following tools are needed to be installed to be able to build the example modules.
 - NodeJS
 - Yarn
 - [Bobril build](https://github.com/bobril/bbcore)

## How to build
In commandline switch to the folder of the example, e. g. [json-transform-example](json-transform-example) and run the following command:

```shell
$ bb b
```

As a result, there should be a file `a.js` in folder `dist`. This is the javascript that should be
uploaded to Evolve.

The testing input data file is [example-input.json](json-transform-example/example-input.json), resp. [example-input.csv](csv-transform-example/example-input.csv) 

## CSV Example with Pipeline
Follow the [detail description](csv-transform-example/README.md).

## Walk-through the source code
TODO