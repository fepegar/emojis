# -*- coding: utf-8 -*-
"""
Created on Sun Feb  5 19:11:29 2017

@author: fernando
"""

#%%
import os

import numpy as np
from skimage import io
from colormath.color_objects import LabColor, sRGBColor
from colormath.color_conversions import convert_color

d = '/Users/fernando/Documents/p5/emojis/images/'

fns = os.listdir(d);

emojis = []                

class Emoji:
    def __init__(self, filepath):
        self.filepath = filepath;
        
    def load(self):
        arr = io.imread(self.filepath)
        self.image = arr[..., :3].astype(float)
        
        mask = arr[..., 3] > 0
        
        idx = np.where(mask)
        pixelsRGB = []
        pixelsLAB = []
        for i, j in zip(*idx):
            pixelRGB = image[i, j]
            pixelsRGB.append(pixelRGB)
#                pixelLAB = convert_color(sRGBColor(*pixelRGB/255), LabColor)
#                pixelsLAB.append(pixelLAB.get_value_tuple())
            
        self.pixelsRGB = np.array(pixelsRGB)
#       pixelsLAB = np.array(pixelsLAB)
        
        self.meanRGB = self.pixelsRGB.mean(axis=0)
    
    
    def getJSON(self):
        fn = os.path.basename(self.filepath)
        d = {'filename': fn, 'meanRGB': list(self.meanRGB)}
        return d
        
                 

for fn in fns:
    if not fn.endswith('png') : continue
    fp = os.path.join(d, fn)
    print fp
    emoji = Emoji(fp)
    emoji.load()
    emojis.append(emoji.getJSON())
    
    
    
import json
lista = range(5)
with open(os.path.join(d, os.pardir, 'emojis.json'), 'w') as f:
    json.dump(emojis, f, sort_keys=True, indent=2)