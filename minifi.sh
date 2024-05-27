#!/bin/bash

# Directorio con los archivos JS originales
SOURCE_DIR="./source"
# Directorio donde se guardarán los archivos minificados
DEST_DIR="./genesjs"

# Crear el directorio de destino si no existe
mkdir -p "$DEST_DIR"

# Recorrer todos los archivos .js en el directorio de origen
for file in "$SOURCE_DIR"/*.js
do
    # Obtener el nombre del archivo sin el directorio
    filename=$(basename "$file")
    # Minificar el archivo y guardarlo en el directorio de destino
    uglifyjs "$file" -o "$DEST_DIR/$filename"
    echo "Minificado: $file -> $DEST_DIR/$filename"
done
