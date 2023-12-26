#!/bin/bash

# Set the source directory
source_dir="./configuration"

# Set the destination directory for zip files
destination_dir="./zipped_configuration"

# Create the destination directory if it doesn't exist
mkdir -p "$destination_dir"

# Iterate over each folder in the source directory
for folder in "$source_dir"/*; do
    # Extract folder name from the path
    folder_name=$(basename "$folder")

    # Skip the "default" folder
    if [ "$folder_name" == "default" ]; then
        continue
    fi

    # Define the zip file name
    zip_file="$destination_dir/$folder_name.zip"

    # Zip the contents of the folder
    pushd $folder
    zip -r "$OLDPWD/$zip_file" *
    popd

    echo "Created $zip_file"
done

echo "Zip creation completed."
