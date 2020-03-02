#!/bin/bash
# Builds all targets and places IPAs in build/

# Constants
PROJECT_NAME="Provigil"
ARCHIVE_NAME="Provigil"
BUILD_TYPE="Release"
BUILD_DIR="$(pwd)/build"

# To make xcpretty work
export LC_ALL=en_US.UTF-8

# Build the workspace
echo "Building the workspace..."
xcodebuild -list

xcodebuild clean -workspace "platforms/ios/${PROJECT_NAME}.xcworkspace" \
                -sdk iphoneos -configuration "${BUILD_TYPE}" clean archive \
                -archivePath "${BUILD_DIR}/${ARCHIVE_NAME}.xcarchive" | xcpretty -s

# Archive
echo "Making IPA archive ..."
xcodebuild -exportArchive -archivePath "${BUILD_DIR}/${ARCHIVE_NAME}.xcarchive" \
            -exportPath "${BUILD_DIR}" -exportOptionsPlist exportOptions.plist  | xcpretty -s
            
ls
cd build
ls
# Remove Archive
#echo "Removing archive ..."
#rm -rf "${BUILD_DIR}/${ARCHIVE_NAME}.xcarchive"