#!/bin/bash

# Install PostgreSQL packages
sudo yum install postgresql postgresql-server postgresql-contrib -y

# Check if the installation was successful
if [ $? -ne 0 ]; then
    echo "PostgreSQL installation failed."
    exit 1
fi

# Initialize the PostgreSQL database
sudo /usr/bin/postgresql-setup --initdb

# Check if the database initialization was successful
if [ $? -ne 0 ]; then
    echo "PostgreSQL database initialization failed."
    exit 1
fi

# Enable PostgreSQL to start on boot
sudo systemctl enable postgresql

# Check if enabling the service was successful
if [ $? -ne 0 ]; then
    echo "Failed to enable PostgreSQL service."
    exit 1
fi

echo "PostgreSQL installation and setup completed successfully."
