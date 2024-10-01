#!/bin/bash

# Read the CSV file line by line
cat file.csv | while IFS="," read -r col1 col2 col3; do
  # Remove double quotes at the beginning and end of each column
  col1=$(echo "$col1" | sed 's/^"//; s/"$//')
  col2=$(echo "$col2" | sed 's/^"//; s/"$//')
  col3=$(echo "$col3" | sed 's/^"//; s/"$//')

  # Do something with the cleaned columns
  echo "$col1, $col2, $col3"
done < input.csv
