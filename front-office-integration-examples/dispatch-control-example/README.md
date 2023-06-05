# Dispatch control example

This repository contains example of using dispatch control (IsCopy property).

## Pre-requisites

Knowledge of Content Author, Front Office, and Generate.

## Description

This example contains three TypeScript projects, which use names with numerical prefixes: 01, 02, 03. These projects should be placed into a single Generate pipeline as scripted steps. In the second script, configure the path to the watermark image (File 'Resources/copyWatermark.png); in the third script, configure the path for the output PDF.

The pipeline can be used from FO during ticket approval, and supports both single and multi-document processing.
