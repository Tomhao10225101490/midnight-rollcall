# Original vector-style icon; optional authoring tool: Pillow 11.3.0.
# System font is rasterized, not copied into the distribution.
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
im=Image.new('RGBA',(1024,1024),(0,0,0,0));d=ImageDraw.Draw(im)
d.rounded_rectangle((0,0,1023,1023),radius=190,fill='#0b191b')
d.rounded_rectangle((46,46,978,978),radius=160,outline='#b3a075',width=7)
d.rectangle((185,360,839,790),fill='#263c38')
for row in range(3):
 for col in range(5):
  x,y=220+col*123,400+row*110;d.rectangle((x,y,x+70,y+65),fill='#cfb16a'if(row+col)%3 else '#102420')
d.rectangle((460,600,565,790),fill='#0b191b');d.line((245,850,780,850),fill='#a33e32',width=14)
font=ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc',115)
d.text((512,220),'末铃点名',font=font,fill='#d7c699',anchor='mm',stroke_width=1)
Path('build').mkdir(exist_ok=True);im.save('build/icon.png')
