#!/usr/bin/env python3
from PIL import Image
import numpy as np

# Load the image
img = Image.open('public/images/pblivin.png')
img = img.convert("RGBA")
data = np.array(img)

# Get the background color from the top-left corner
bg_color = data[0, 0][:3]  # RGB values

# Create a mask for pixels that match the background color
# Using a tolerance to catch similar colors
tolerance = 30
mask = np.all(np.abs(data[:, :, :3] - bg_color) < tolerance, axis=2)

# Set alpha channel to 0 for background pixels
data[:, :, 3] = np.where(mask, 0, data[:, :, 3])

# Save the result
new_img = Image.fromarray(data, 'RGBA')
new_img.save('public/images/pblivin-transparent.png')
print("Created pblivin-transparent.png with transparent background")